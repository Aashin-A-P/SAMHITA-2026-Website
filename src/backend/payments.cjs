const express = require('express');
const router = express.Router();

module.exports = function (db) {
  router.get('/upi', async (req, res) => {
    try {
      const [accounts] = await db.execute('SELECT id, upi FROM upi_accounts ORDER BY id ASC');
      if (!accounts.length) {
        return res.status(404).json({ message: 'No UPI accounts configured.' });
      }
      const [[state]] = await db.execute('SELECT current_index FROM upi_rotation_state WHERE id = 1');
      const idx = Math.max(1, Number(state?.current_index) || 1);
      const account = accounts[(idx - 1) % accounts.length];
      res.json({ upi: account.upi });
    } catch (error) {
      console.error('Failed to fetch UPI:', error);
      res.status(500).json({ message: 'Failed to fetch UPI.' });
    }
  });

  return router;
};
