const express = require('express');

module.exports = function (db) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { passId, teamName, members, createdBy } = req.body;

    if (!passId || !teamName || !Array.isArray(members) || !createdBy) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    if (members.length < 2 || members.length > 4) {
      return res.status(400).json({ message: 'Team must have 2 to 4 members.' });
    }

    const uniqueMembers = Array.from(new Set(members.filter(Boolean)));
    if (uniqueMembers.length !== members.length) {
      return res.status(400).json({ message: 'Duplicate member IDs are not allowed.' });
    }

    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const [users] = await connection.execute(
        `SELECT id FROM users WHERE id IN (${members.map(() => '?').join(',')})`,
        members
      );
      if (users.length !== members.length) {
        await connection.rollback();
        return res.status(400).json({ message: 'One or more member IDs are invalid.' });
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
        if (!eventRow || !String(eventRow.eventName || '').toLowerCase().includes('hackathon')) {
          return res.status(404).json({ message: 'No pass mapped to this event.' });
        }
        const [[hackathonPass]] = await db.execute(
          "SELECT id FROM passes WHERE LOWER(name) LIKE '%hackathon%' LIMIT 1"
        );
        if (!hackathonPass) {
          return res.status(404).json({ message: 'Hackathon pass not found.' });
        }
        passId = hackathonPass.id;
      }
      const [teams] = await db.execute(
        `SELECT 
           pt.id, pt.teamName, pt.createdBy, pt.member1Id, pt.member2Id, pt.member3Id, pt.member4Id,
           u1.fullName as member1Name, u1.email as member1Email,
           u2.fullName as member2Name, u2.email as member2Email,
           u3.fullName as member3Name, u3.email as member3Email,
           u4.fullName as member4Name, u4.email as member4Email
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

  return router;
};
