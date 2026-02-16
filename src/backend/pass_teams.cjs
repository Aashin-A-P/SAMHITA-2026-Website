const express = require('express');

module.exports = function (db) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { passId, teamName, members, createdBy } = req.body;

    if (!passId || !teamName || !Array.isArray(members) || !createdBy) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const uniqueMembers = Array.from(new Set(members.filter(Boolean)));
    if (uniqueMembers.length !== members.length) {
      return res.status(400).json({ message: 'Duplicate member IDs are not allowed.' });
    }

    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const [[pass]] = await connection.execute('SELECT name FROM passes WHERE id = ?', [passId]);
      const passName = String(pass?.name || '').toLowerCase();
      const isHackathon = passName.includes('hackathon');
      const isPaper = passName.includes('paper') && passName.includes('presentation');
      const minMembers = 2;
      const maxMembers = isPaper ? 3 : 4;
      if (members.length < minMembers || members.length > maxMembers) {
        return res.status(400).json({ message: `Team must have ${minMembers} to ${maxMembers} members.` });
      }

      const [users] = await connection.execute(
        `SELECT id FROM users WHERE id IN (${members.map(() => '?').join(',')})`,
        members
      );
      if (users.length !== members.length) {
        await connection.rollback();
        return res.status(400).json({ message: 'One or more member IDs are invalid.' });
      }

      const [existingTeam] = await connection.execute(
        'SELECT id FROM pass_teams WHERE passId = ? AND teamName = ? LIMIT 1',
        [passId, teamName]
      );
      if (existingTeam.length > 0) {
        await connection.rollback();
        return res.status(409).json({ message: 'Team name already taken.' });
      }

      const [result] = await connection.execute(
        `INSERT INTO pass_teams (passId, teamName, createdBy, member1Id, member2Id, member3Id, member4Id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          passId,
          teamName,
          createdBy,
          members[0],
          members[1],
          members[2] || null,
          members[3] || null,
        ]
      );

      // Do not create registrations here.
      // Team creation should not mark a pass as purchased; payment flow will create registrations.

      await connection.commit();
      res.status(201).json({ message: 'Team saved.', teamId: result.insertId });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Error creating team:', error);
      res.status(500).json({ message: 'Failed to create team.' });
    } finally {
      if (connection) connection.release();
    }
  });

  // Get teams by event (hackathon) via pass mapping
  router.get('/by-event/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
      let passId = null;
      const [[passRow]] = await db.execute(
        'SELECT passId FROM pass_events WHERE eventId = ?',
        [eventId]
      );
      if (passRow && passRow.passId) {
        passId = passRow.passId;
      } else {
        const [[eventRow]] = await db.execute(
          'SELECT eventName FROM events WHERE id = ?',
          [eventId]
        );
        const eventNameLower = String(eventRow.eventName || '').toLowerCase();
        const isHackathonEvent = eventNameLower.includes('hackathon');
        const isPaperEvent = eventNameLower.includes('paper') && eventNameLower.includes('presentation');
        if (!isHackathonEvent && !isPaperEvent) {
          return res.status(404).json({ message: 'No pass mapped to this event.' });
        }
        if (isHackathonEvent) {
          const [[hackathonPass]] = await db.execute(
            "SELECT id FROM passes WHERE LOWER(name) LIKE '%hackathon%' LIMIT 1"
          );
          if (!hackathonPass) {
            return res.status(404).json({ message: 'Hackathon pass not found.' });
          }
          passId = hackathonPass.id;
        } else {
          const [[paperPass]] = await db.execute(
            "SELECT id FROM passes WHERE LOWER(name) LIKE '%paper%presentation%' LIMIT 1"
          );
          if (!paperPass) {
            return res.status(404).json({ message: 'Paper presentation pass not found.' });
          }
          passId = paperPass.id;
        }
      }
      const [teams] = await db.execute(
        `SELECT 
           pt.id, pt.teamName, pt.createdBy, pt.member1Id, pt.member2Id, pt.member3Id, pt.member4Id,
           u1.fullName as member1Name, u1.email as member1Email, u1.mobile as member1Mobile, u1.college as member1College, u1.department as member1Department, u1.yearofPassing as member1YearOfPassing,
           u2.fullName as member2Name, u2.email as member2Email, u2.mobile as member2Mobile, u2.college as member2College, u2.department as member2Department, u2.yearofPassing as member2YearOfPassing,
           u3.fullName as member3Name, u3.email as member3Email, u3.mobile as member3Mobile, u3.college as member3College, u3.department as member3Department, u3.yearofPassing as member3YearOfPassing,
           u4.fullName as member4Name, u4.email as member4Email, u4.mobile as member4Mobile, u4.college as member4College, u4.department as member4Department, u4.yearofPassing as member4YearOfPassing
         FROM pass_teams pt
         LEFT JOIN users u1 ON u1.id = pt.member1Id
         LEFT JOIN users u2 ON u2.id = pt.member2Id
         LEFT JOIN users u3 ON u3.id = pt.member3Id
         LEFT JOIN users u4 ON u4.id = pt.member4Id
         WHERE pt.passId = ?`,
        [passId]
      );
      res.json(teams);
    } catch (error) {
      console.error('Error fetching teams by event:', error);
      res.status(500).json({ message: 'Failed to fetch teams.' });
    }
  });

  router.delete('/:teamId', async (req, res) => {
    const { teamId } = req.params;
    try {
      const [result] = await db.execute('DELETE FROM pass_teams WHERE id = ?', [teamId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Team not found.' });
      }
      res.json({ message: 'Team deleted.' });
    } catch (error) {
      console.error('Error deleting team:', error);
      res.status(500).json({ message: 'Failed to delete team.' });
    }
  });

  return router;
};
