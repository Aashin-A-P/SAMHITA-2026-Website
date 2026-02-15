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

    try {
      const [users] = await db.execute(
        `SELECT id FROM users WHERE id IN (${members.map(() => '?').join(',')})`,
        members
      );
      if (users.length !== members.length) {
        return res.status(400).json({ message: 'One or more member IDs are invalid.' });
      }

      const [result] = await db.execute(
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

      res.status(201).json({ message: 'Team saved.', teamId: result.insertId });
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(500).json({ message: 'Failed to create team.' });
    }
  });

  return router;
};
