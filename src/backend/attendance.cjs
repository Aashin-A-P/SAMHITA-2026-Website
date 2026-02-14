const express = require('express');
const router = express.Router();

module.exports = function (db) {
  router.get('/event/:eventId', async (req, res) => {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: 'eventId is required.' });
    }

    try {
      const [rows] = await db.execute(
        `SELECT a.userId, u.email
         FROM attendance a
         LEFT JOIN users u ON a.userId = u.id
         WHERE a.eventId = ?`,
        [eventId]
      );
      res.json(rows);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      res.status(500).json({ message: 'Failed to fetch attendance.' });
    }
  });

  router.post('/mark', async (req, res) => {
    const { eventId, userId } = req.body;
    if (!eventId || !userId) {
      return res.status(400).json({ message: 'eventId and userId are required.' });
    }

    try {
      await db.execute(
        `INSERT INTO attendance (userId, eventId)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE markedAt = CURRENT_TIMESTAMP`,
        [userId, eventId]
      );
      res.json({ message: 'Attendance marked.' });
    } catch (error) {
      console.error('Error marking attendance:', error);
      res.status(500).json({ message: 'Failed to mark attendance.' });
    }
  });

  router.post('/unmark', async (req, res) => {
    const eventId = req.body?.eventId ?? req.query?.eventId;
    const userId = req.body?.userId ?? req.query?.userId;
    if (!eventId || !userId) {
      return res.status(400).json({ message: 'eventId and userId are required.' });
    }

    try {
      await db.execute(
        'DELETE FROM attendance WHERE userId = ? AND eventId = ?',
        [userId, eventId]
      );
      res.json({ message: 'Attendance reverted.' });
    } catch (error) {
      console.error('Error reverting attendance:', error);
      res.status(500).json({ message: 'Failed to revert attendance.' });
    }
  });

  return router;
};
