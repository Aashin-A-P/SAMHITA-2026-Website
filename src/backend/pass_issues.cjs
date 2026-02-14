const express = require('express');
const router = express.Router();

module.exports = function (db) {
  // List pass registrations with issue status
  router.get('/list', async (req, res) => {
    const passId = req.query.passId;
    try {
      const params = [];
      let whereClause = 'WHERE r.passId IS NOT NULL';
      if (passId && passId !== 'all') {
        whereClause += ' AND r.passId = ?';
        params.push(passId);
      }

      const [rows] = await db.execute(
        `
        SELECT 
          u.id as userId,
          u.fullName,
          u.email,
          u.mobile,
          r.passId,
          p.name as passName,
          CASE WHEN pi.issued = 1 THEN 1 ELSE 0 END as issued
        FROM registrations r
        JOIN users u ON r.userEmail = u.email
        JOIN passes p ON r.passId = p.id
        LEFT JOIN pass_issues pi ON pi.userId = u.id AND pi.passId = r.passId
        ${whereClause}
        GROUP BY u.id, r.passId
        ORDER BY u.fullName ASC
        `,
        params
      );

      res.json(rows);
    } catch (error) {
      console.error('Error fetching pass issues list:', error);
      res.status(500).json({ message: 'Failed to fetch pass issue list.' });
    }
  });

  // Issued passes for a user
  router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const [rows] = await db.execute(
        'SELECT passId FROM pass_issues WHERE userId = ? AND issued = 1',
        [userId]
      );
      res.json(rows.map(r => r.passId));
    } catch (error) {
      console.error('Error fetching user pass issues:', error);
      res.status(500).json({ message: 'Failed to fetch pass issue status.' });
    }
  });

  // Issue pass
  router.post('/issue', async (req, res) => {
    const { userId, passId } = req.body;
    if (!userId || !passId) {
      return res.status(400).json({ message: 'userId and passId are required.' });
    }
    try {
      await db.execute(
        `INSERT INTO pass_issues (userId, passId, issued)
         VALUES (?, ?, 1)
         ON DUPLICATE KEY UPDATE issued = 1, issuedAt = CURRENT_TIMESTAMP`,
        [userId, passId]
      );
      res.json({ message: 'Pass issued.' });
    } catch (error) {
      console.error('Error issuing pass:', error);
      res.status(500).json({ message: 'Failed to issue pass.' });
    }
  });

  // Revert issue
  router.post('/revert', async (req, res) => {
    const { userId, passId } = req.body;
    if (!userId || !passId) {
      return res.status(400).json({ message: 'userId and passId are required.' });
    }
    try {
      await db.execute(
        'DELETE FROM pass_issues WHERE userId = ? AND passId = ?',
        [userId, passId]
      );
      res.json({ message: 'Pass issue reverted.' });
    } catch (error) {
      console.error('Error reverting pass issue:', error);
      res.status(500).json({ message: 'Failed to revert pass issue.' });
    }
  });

  return router;
};
