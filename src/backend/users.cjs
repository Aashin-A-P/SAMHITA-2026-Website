const express = require('express');

module.exports = function (db) {
  const router = express.Router();

  // Get user by ID (for lookup)
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [[user]] = await db.execute(
        'SELECT id, fullName, email FROM users WHERE id = ?',
        [id]
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by id:', error);
      res.status(500).json({ message: 'Failed to fetch user.' });
    }
  });

  return router;
};
