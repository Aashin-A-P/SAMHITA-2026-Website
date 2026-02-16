const express = require('express');
const router = express.Router();

module.exports = function (db) {
  // List coupons
  router.get('/', async (_req, res) => {
    try {
      const [rows] = await db.execute(
        'SELECT id, name, `limit`, discountPercent, onlyForMit, createdAt FROM coupons ORDER BY id DESC'
      );
      res.json(rows);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      res.status(500).json({ message: 'Failed to fetch coupons.' });
    }
  });

  // Validate coupon by code
  router.get('/validate', async (req, res) => {
    const code = (req.query.code || '').toString().trim();
    const college = (req.query.college || '').toString();
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required.' });
    }

    try {
      const [rows] = await db.execute(
        'SELECT id, name, `limit`, discountPercent, onlyForMit FROM coupons WHERE name = ?',
        [code]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Invalid coupon code.' });
      }
      const coupon = rows[0];
      if (coupon.limit <= 0) {
        return res.status(400).json({ message: 'Coupon expired.' });
      }
      if (coupon.onlyForMit) {
        const normalized = college.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isMit = normalized.includes('madrasinstituteoftechnology') || normalized === 'mit';
        if (!isMit) {
          return res.status(403).json({ message: 'Invalid coupon.' });
        }
      }
      res.json({
        valid: true,
        code: coupon.name,
        discountPercent: coupon.discountPercent,
        remaining: coupon.limit,
        onlyForMit: coupon.onlyForMit === 1
      });
    } catch (error) {
      console.error('Error validating coupon:', error);
      res.status(500).json({ message: 'Failed to validate coupon.' });
    }
  });

  // Create coupon
  router.post('/', async (req, res) => {
    const { name, limit, discountPercent, onlyForMit } = req.body;
    if (!name || limit === undefined || discountPercent === undefined) {
      return res.status(400).json({ message: 'Missing name, limit, or discountPercent.' });
    }
    try {
      await db.execute(
        'INSERT INTO coupons (name, `limit`, discountPercent, onlyForMit) VALUES (?, ?, ?, ?)',
        [name, Number(limit), Number(discountPercent), onlyForMit ? 1 : 0]
      );
      res.status(201).json({ message: 'Coupon created.' });
    } catch (error) {
      console.error('Error creating coupon:', error);
      res.status(500).json({ message: 'Failed to create coupon.' });
    }
  });

  // Update coupon
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, limit, discountPercent, onlyForMit } = req.body;
    try {
      await db.execute(
        'UPDATE coupons SET name = ?, `limit` = ?, discountPercent = ?, onlyForMit = ? WHERE id = ?',
        [name, Number(limit), Number(discountPercent), onlyForMit ? 1 : 0, id]
      );
      res.json({ message: 'Coupon updated.' });
    } catch (error) {
      console.error('Error updating coupon:', error);
      res.status(500).json({ message: 'Failed to update coupon.' });
    }
  });

  // Delete coupon
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.execute('DELETE FROM coupons WHERE id = ?', [id]);
      res.json({ message: 'Coupon deleted.' });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      res.status(500).json({ message: 'Failed to delete coupon.' });
    }
  });

  return router;
};
