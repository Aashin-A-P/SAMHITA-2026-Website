const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

module.exports = function (db, uploadEventPoster, transporter) {
  router.post('/', async (req, res) => {
    const {
      symposiumName,
      eventName,
      eventCategory,
      eventDescription,
      numberOfRounds,
      teamOrIndividual,
      location,
      registrationFees,
      organizerId,
      lastDateForRegistration,
      isOpenForNonMIT,
      rounds,
      passId,
    } = req.body;

    const passIdNumber = passId !== undefined && passId !== null ? parseInt(passId, 10) : NaN;

    if (!eventName || !eventDescription ||
      numberOfRounds === undefined || !teamOrIndividual || !location ||
      registrationFees === undefined || !lastDateForRegistration || !rounds || Number.isNaN(passIdNumber)) {
      return res.status(400).json({ message: 'Missing required event fields.' });
    }

    try {
      let coordinatorName = req.body.coordinatorName;
      let coordinatorContactNo = req.body.coordinatorContactNo;
      let coordinatorMail = req.body.coordinatorMail;

      if (organizerId) {
        const [[organizer]] = await db.execute('SELECT name, mobile, email FROM organizers WHERE id = ?', [organizerId]);
        if (!organizer) {
          return res.status(404).json({ message: 'Organizer not found.' });
        }
        coordinatorName = organizer.name;
        coordinatorContactNo = organizer.mobile;
        coordinatorMail = organizer.email;
      }

      if (!coordinatorName || !coordinatorContactNo || !coordinatorMail) {
        return res.status(400).json({ message: 'Coordinator details are required.' });
      }

      const eventTable = 'events';
      const roundsTable = 'rounds';

      const [eventResult] = await db.execute(
        `INSERT INTO ${eventTable} (
          eventName, eventCategory, eventDescription, numberOfRounds, teamOrIndividual,
          location, registrationFees, coordinatorName, coordinatorContactNo, coordinatorMail,
          lastDateForRegistration, open_to_non_mit
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eventName, eventCategory || '', eventDescription, numberOfRounds, teamOrIndividual,
          location, registrationFees, coordinatorName, coordinatorContactNo, coordinatorMail,
          lastDateForRegistration, isOpenForNonMIT ? 1 : 0,
        ]
      );


      const eventId = eventResult.insertId;

      if (!Number.isNaN(passIdNumber)) {
        await db.execute(
          'INSERT INTO pass_events (passId, eventId) VALUES (?, ?)',
          [passIdNumber, eventId]
        );
      }

      for (const round of rounds) {
        await db.execute(
          `INSERT INTO ${roundsTable} (eventId, roundNumber, roundDetails, roundDateTime) VALUES (?, ?, ?, ?)`,
          [eventId, round.roundNumber, round.roundDetails, round.roundDateTime]
        );
      }

      res.status(201).json({ message: 'Event added successfully.', eventId });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add event.' });
    }
  });
  router.post('/apply-discount', async (req, res) => {
    const { symposiumName, eventCategory, discountPercentage, discountReason, isForMIT } = req.body;

    if (!eventCategory || discountPercentage === undefined) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const eventTable = 'events';

    try {
      if (isForMIT) {
        await db.execute(
          `UPDATE ${eventTable} SET mit_discount_percentage = ? WHERE eventCategory = ?`,
          [discountPercentage, eventCategory]
        );
      } else {
        await db.execute(
          `UPDATE ${eventTable} SET discountPercentage = ?, discountReason = ? WHERE eventCategory = ?`,
          [discountPercentage, discountReason || '', eventCategory]
        );
      }
      res.status(200).json({ message: 'Discounts updated successfully.' });
    } catch (error) {
      console.error('Error applying discount:', error);
      res.status(500).json({ message: 'Failed to apply discount.' });
    }
  });

  // [UPDATED] Get all events (Include discount columns in SELECT)
  router.get('/', async (req, res) => {
    try {
      // Added discountPercentage and discountReason to the SELECT query
      const [events] = await db.execute('SELECT id, eventName, eventCategory, eventDescription, numberOfRounds, teamOrIndividual, location, registrationFees, coordinatorName, coordinatorContactNo, coordinatorMail, lastDateForRegistration, posterImage, open_to_non_mit, discountPercentage, discountReason, mit_discount_percentage, createdAt FROM events');

      const allEvents = [];
      // ... (Rest of the loop logic remains the same) ...
      for (const event of events) {
        if (event.posterImage) {
          event.posterImage = event.posterImage.toString('base64');
        }
        const [rounds] = await db.execute('SELECT roundNumber, roundDetails, roundDateTime FROM rounds WHERE eventId = ?', [event.id]);
        const [[passMapping]] = await db.execute(
          'SELECT p.id as passId, p.name as passName FROM pass_events pe JOIN passes p ON p.id = pe.passId WHERE pe.eventId = ?',
          [event.id]
        );
        allEvents.push({ ...event, symposiumName: 'SAMHITA', rounds, passId: passMapping ? passMapping.passId : null, passName: passMapping ? passMapping.passName : null });
      }

      res.json(allEvents);
    } catch (error) {
      // ... existing error handling
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Failed to fetch events.' });
    }
  });

  // [UPDATED] Get specific event (Include discount columns in SELECT)
  router.get('/:id', async (req, res) => {
    // ... existing setup ...
    const { id } = req.params;
    const eventTable = 'events';

    try {
      const [rows] = await db.execute(`SELECT * FROM ${eventTable} WHERE id = ?`, [id]);
      // ... rest of the function remains the same
      if (rows.length === 0) { return res.status(404).json({ message: 'Event not found.' }); }
      const event = rows[0];
      if (event.posterImage) { event.posterImage = event.posterImage.toString('base64'); }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch event.' });
    }
  });


  router.get('/:eventId/registrations', async (req, res) => {
    const { eventId } = req.params;
    const symposium = 'SAMHITA';

    try {
      const [registrations] = await db.execute(
        `SELECT 
            u.id as userId, 
            u.fullName as name, 
            u.email, 
            u.mobile, 
            u.department, 
            u.yearofPassing, 
            u.college,
            MAX(COALESCE(r_event.id, r_pass.id)) as id,
            u.email as userEmail,
            ? as eventId,
            MAX(COALESCE(r_event.round1, r_pass.round1, 0)) as round1,
            MAX(COALESCE(r_event.round2, r_pass.round2, 0)) as round2,
            MAX(COALESCE(r_event.round3, r_pass.round3, 0)) as round3,
            MAX(COALESCE(r_event.symposium, r_pass.symposium)) as symposium
         FROM users u
         JOIN (
            SELECT DISTINCT userId FROM verified_registrations 
            WHERE eventId = ? AND verified = true
            
            UNION
            
            SELECT DISTINCT vr.userId
            FROM verified_registrations vr
         JOIN passes p ON vr.passId = p.id
         JOIN pass_events pe_event ON pe_event.eventId = ?
         WHERE vr.verified = true
              AND LOWER(p.name) <> 'workshop pass'
              AND (
                p.id = pe_event.passId OR
                (LOWER(p.name) LIKE '%global%' AND pe_event.passId IN (
                  SELECT id FROM passes WHERE LOWER(name) LIKE '%tech pass%' AND LOWER(name) NOT LIKE '%non-tech%' AND LOWER(name) NOT LIKE '%non tech%'
                  UNION
                  SELECT id FROM passes WHERE LOWER(name) LIKE '%non-tech pass%' OR LOWER(name) LIKE '%non tech pass%' OR LOWER(name) LIKE '%nontech pass%'
                ))
              )
            
            UNION
            
            SELECT DISTINCT vr.userId
            FROM verified_registrations vr
            JOIN passes p ON vr.passId = p.id
            JOIN workshop_pass_registrations wpr
              ON wpr.userId = vr.userId
             AND wpr.passId = vr.passId
             AND wpr.eventId = ?
            WHERE vr.verified = true
              AND LOWER(p.name) = 'workshop pass'
         ) vr_all ON u.id = vr_all.userId
         LEFT JOIN registrations r_event ON u.email = r_event.userEmail AND r_event.eventId = ? AND r_event.symposium = ?
         LEFT JOIN registrations r_pass ON u.email = r_pass.userEmail AND r_pass.passId IS NOT NULL AND r_pass.symposium = ?
         WHERE (r_event.id IS NOT NULL OR r_pass.id IS NOT NULL)
         GROUP BY u.id, u.fullName, u.email, u.mobile, u.department, u.yearofPassing, u.college`,
        [eventId, eventId, eventId, eventId, eventId, symposium, symposium]
      );
      res.json(registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ message: 'Failed to fetch registrations.' });
    }
  });

  router.put('/:id', async (req, res) => {
    const { id } = req.params;
      const {
        symposiumName,
        eventName,
        eventCategory,
        eventDescription,
        numberOfRounds,
        teamOrIndividual,
        location,
        registrationFees,
        coordinatorName,
        coordinatorContactNo,
        coordinatorMail,
        lastDateForRegistration,
        isOpenForNonMIT,
        rounds,
        passId,
      } = req.body;

    const passIdNumber = passId !== undefined && passId !== null ? parseInt(passId, 10) : NaN;

    if (!eventName || !eventDescription ||
      numberOfRounds === undefined || !teamOrIndividual || !location ||
      registrationFees === undefined || !coordinatorName || !coordinatorContactNo ||
      !coordinatorMail || !lastDateForRegistration || !rounds || Number.isNaN(passIdNumber)) {
      return res.status(400).json({ message: 'Missing required event fields.' });
    }

    try {
      const eventTable = 'events';
      const roundsTable = 'rounds';

      await db.execute(
        `UPDATE ${eventTable} SET
          eventName = ?, eventCategory = ?, eventDescription = ?, numberOfRounds = ?, teamOrIndividual = ?,
          location = ?, registrationFees = ?, coordinatorName = ?, coordinatorContactNo = ?, coordinatorMail = ?,
          lastDateForRegistration = ?, open_to_non_mit = ?
        WHERE id = ?`,
        [
          eventName, eventCategory || '', eventDescription, numberOfRounds, teamOrIndividual,
          location, registrationFees, coordinatorName, coordinatorContactNo, coordinatorMail,
          lastDateForRegistration, isOpenForNonMIT ? 1 : 0, id,
        ]
      );

      await db.execute('DELETE FROM pass_events WHERE eventId = ?', [id]);
      if (!Number.isNaN(passIdNumber)) {
        await db.execute('INSERT INTO pass_events (passId, eventId) VALUES (?, ?)', [passIdNumber, id]);
      }


      // Delete existing rounds and insert new ones
      await db.execute(`DELETE FROM ${roundsTable} WHERE eventId = ?`, [id]);
      for (const round of rounds) {
        await db.execute(
          `INSERT INTO ${roundsTable} (eventId, roundNumber, roundDetails, roundDateTime) VALUES (?, ?, ?, ?)`,
          [id, round.roundNumber, round.roundDetails, round.roundDateTime]
        );
      }

      res.json({ message: `Event ${id} has been updated.` });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Failed to update event.', error: error.message });
    }
  });

  // Route to upload event poster
  router.post('/:id/poster', uploadEventPoster.single('poster'), async (req, res) => {
    const { id } = req.params;
    const eventTable = 'events';

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const posterImage = req.file.buffer;

    try {
      await db.execute(
        `UPDATE ${eventTable} SET posterImage = ? WHERE id = ?`,
        [posterImage, id]
      );
      res.status(200).json({ message: 'Poster uploaded successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload poster.' });
    }
  });

  // Route to delete event poster
  router.delete('/:id/poster', async (req, res) => {
    const { id } = req.params;
    const eventTable = 'events';

    try {
      await db.execute(`UPDATE ${eventTable} SET posterImage = NULL WHERE id = ?`, [id]);
      res.status(200).json({ message: 'Poster removed successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove poster.' });
    }
  });

  // event_accounts endpoints removed for SAMHITA DB

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const eventTable = 'events';
    const roundsTable = 'rounds';

    try {
      // Delete associated rounds first
      await db.execute(`DELETE FROM ${roundsTable} WHERE eventId = ?`, [id]);

      // Then delete the event
      await db.execute(`DELETE FROM ${eventTable} WHERE id = ?`, [id]);
      res.json({ message: 'Event deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete event.' });
    }
  });

  router.get('/:eventId/registrations/search', async (req, res) => {
    const { eventId } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email query parameter is required.' });
    }

    try {
      const [registrations] = await db.execute(
        `SELECT r.*, u.id as userId, u.fullName, u.email, u.mobile, u.college, u.department, u.yearofPassing 
         FROM registrations r 
         JOIN users u ON r.userEmail = u.email 
         WHERE r.eventId = ? AND u.email = ?`,
        [eventId, email]
      );

      if (registrations.length === 0) {
        return res.status(404).json({ message: 'User not found or not registered for this event.' });
      }

      res.json(registrations[0]);
    } catch (error) {
      res.status(500).json({ message: 'Failed to search for registration.' });
    }
  });

  router.post('/:eventId/rounds/:roundNumber/eligible', async (req, res) => {
    const { eventId, roundNumber } = req.params;
    const { userId, status } = req.body;
    const symposium = 'SAMHITA';

    if (!userId || status === undefined) {
      return res.status(400).json({ message: 'userId and status are required.' });
    }

    if (![0, 1].includes(status)) {
      return res.status(400).json({ message: 'Status must be 0 or 1.' });
    }

    const dbStatus = Number(status) === 1 ? 1 : -1;

    const roundColumn = `round${roundNumber}`;
    if (!['round1', 'round2', 'round3'].includes(roundColumn)) {
      return res.status(400).json({ message: 'Invalid round number.' });
    }

    try {
      const [[user]] = await db.execute('SELECT fullName, email, mobile FROM users WHERE id = ?', [userId]);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const userEmail = user.email;

      const [result] = await db.execute(
        `UPDATE registrations SET ${roundColumn} = ? WHERE userEmail = ? AND eventId = ? AND symposium = ?`,
        [dbStatus, userEmail, eventId, symposium]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Registration not found for this user and event.' });
      }

      res.status(200).json({ message: `Round ${roundNumber} status updated successfully.` });
    } catch (error) {
      console.error('Error updating round status:', error);
      res.status(500).json({ message: 'Failed to update round status.' });
    }
  });

  router.post('/:eventId/rounds/:roundNumber/notify', async (req, res) => {
    const { eventId, roundNumber } = req.params;
    const { eligibleMessage, ineligibleMessage } = req.body;
    const symposium = 'SAMHITA';

    try {
      const [registrations] = await db.execute(
        `SELECT r.*, u.email 
         FROM registrations r 
         JOIN users u ON r.userEmail = u.email 
         WHERE r.eventId = ? AND r.symposium = ?`,
        [eventId, symposium]
      );

      if (registrations.length === 0) {
        return res.status(404).json({ message: 'No registrations found for this event.' });
      }

      const eventTable = 'events';

      const [[event]] = await db.execute(`SELECT eventName FROM ${eventTable} WHERE id = ?`, [eventId]);
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }

      const roundColumn = `round${roundNumber}`;
      const eligibleUsers = registrations.filter(r => r[roundColumn] === 1);
      const ineligibleUsers = registrations.filter(r => r[roundColumn] === 0);

      const emailSubject = `Update for ${event.eventName} - Round ${roundNumber}`;

      if (eligibleUsers.length > 0) {
        const eligibleEmails = eligibleUsers.map(u => u.email);
        await transporter.sendMail({
          from: `"Samhita'26 team" <itasamhita26@gmail.com>`,
          to: eligibleEmails.join(', '),
          subject: emailSubject,
          text: eligibleMessage, // fallback for email clients not supporting HTML
          html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        ${eligibleMessage}
        <br/>
        <p style="margin-top: 20px;">Regards,<br/><strong>SAMHITA'26 Team</strong></p>
      </div>
    `
        });
      }

      if (ineligibleUsers.length > 0) {
        const ineligibleEmails = ineligibleUsers.map(u => u.email);
        await transporter.sendMail({
          from: `"Samhita'26 team" <itasamhita26@gmail.com>`,
          to: ineligibleEmails.join(', '),
          subject: emailSubject,
          text: ineligibleMessage,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
              ${ineligibleMessage}
              <br/>
              <p style="margin-top: 20px;">Regards,<br/><strong>SAMHITA'26 Team</strong></p>
            </div>
          `
        });
      }
      res.status(200).json({ message: 'Notifications sent successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send notifications.' });
    }
  });

  return router;
};
