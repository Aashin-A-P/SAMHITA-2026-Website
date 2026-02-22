const express = require('express');
const router = express.Router();

module.exports = function (db) {
  const isWorkshopPassName = (name) => String(name || '').trim().toLowerCase() === 'workshop pass';
  const getLocalDateKey = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  async function validateWorkshopSelections(passId, eventIds) {
    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return { ok: false, message: 'Please select at least one workshop.' };
    }

    const uniqueEventIds = [...new Set(eventIds.map((id) => Number(id)).filter((id) => !Number.isNaN(id)))];
    if (uniqueEventIds.length === 0) {
      return { ok: false, message: 'Invalid workshop selection.' };
    }

    const placeholders = uniqueEventIds.map(() => '?').join(',');
    const [mappedRows] = await db.execute(
      `SELECT eventId FROM pass_events WHERE passId = ? AND eventId IN (${placeholders})`,
      [passId, ...uniqueEventIds]
    );
    if (mappedRows.length !== uniqueEventIds.length) {
      return { ok: false, message: 'One or more selected workshops are not part of this pass.' };
    }

    const [roundRows] = await db.execute(
      `SELECT e.id as eventId, e.eventName, r.roundDateTime
       FROM events e
       JOIN rounds r ON r.eventId = e.id AND r.roundNumber = 1
       WHERE e.id IN (${placeholders})`,
      uniqueEventIds
    );

    if (roundRows.length !== uniqueEventIds.length) {
      return { ok: false, message: 'Each workshop must have exactly one round date set.' };
    }

    const seenDates = new Set();
    for (const row of roundRows) {
      const key = getLocalDateKey(row.roundDateTime);
      if (!key) {
        return { ok: false, message: `Invalid round date for workshop ${row.eventName || row.eventId}.` };
      }
      if (seenDates.has(key)) {
        return { ok: false, message: 'You cannot select two workshops with round 1 on the same day.' };
      }
      seenDates.add(key);
    }

    return { ok: true, eventIds: uniqueEventIds };
  }

  // Add item to pass cart
  router.post('/', async (req, res) => {
    const { userId, passId, eventIds } = req.body;

    if (!userId || !passId) {
      return res.status(400).json({ message: 'Missing userId or passId.' });
    }

    try {
      const [[pass]] = await db.execute('SELECT name FROM passes WHERE id = ?', [passId]);
      if (!pass) {
        return res.status(404).json({ message: 'Pass not found.' });
      }
      const isWorkshopPass = isWorkshopPassName(pass.name);

      if (isWorkshopPass) {
        const selectionCheck = await validateWorkshopSelections(passId, eventIds);
        if (!selectionCheck.ok) {
          return res.status(400).json({ message: selectionCheck.message });
        }
      }

      // Get user email
      const [users] = await db.execute('SELECT email FROM users WHERE id = ?', [userId]);
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const userEmail = users[0].email;

      // Check if already registered
      const [existingRegistration] = await db.execute(
        'SELECT id FROM registrations WHERE userEmail = ? AND passId = ?',
        [userEmail, passId]
      );

      if (existingRegistration.length > 0) {
        return res.status(409).json({ message: 'You have already purchased this pass.' });
      }

      // Check if the item is already in the cart for this user
      const [existingCartItem] = await db.execute(
        'SELECT * FROM pass_cart WHERE userId = ? AND passId = ?',
        [userId, passId]
      );

      if (existingCartItem.length > 0) {
        return res.status(409).json({ message: 'Pass already in cart.' });
      }

      const [insertResult] = await db.execute(
        'INSERT INTO pass_cart (userId, passId) VALUES (?, ?)',
        [userId, passId]
      );

      if (isWorkshopPass) {
        const uniqueEventIds = [...new Set(eventIds.map((id) => Number(id)).filter((id) => !Number.isNaN(id)))];
        if (uniqueEventIds.length > 0) {
          const values = uniqueEventIds.map(() => '(?, ?)').join(', ');
          const params = uniqueEventIds.flatMap((id) => [insertResult.insertId, id]);
          await db.execute(
            `INSERT INTO pass_cart_workshops (cartId, eventId) VALUES ${values}`,
            params
          );
        }
      }

      res.status(201).json({ message: 'Pass added to cart successfully.' });
    } catch (error) {
      console.error('Error adding pass to cart:', error);
      res.status(500).json({ message: 'Failed to add pass to cart.' });
    }
  });

  // Get cart items for a user
  router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      const [cartItems] = await db.execute(
        'SELECT pc.id, p.id as passId, p.name, p.cost, p.description FROM pass_cart pc JOIN passes p ON pc.passId = p.id WHERE pc.userId = ?',
        [userId]
      );

      const normalized = [];
      for (const item of cartItems) {
        if (isWorkshopPassName(item.name)) {
          const [workshops] = await db.execute(
            `SELECT e.id as eventId, e.eventName, e.registrationFees, r.roundDateTime
             FROM pass_cart_workshops pcw
             JOIN events e ON e.id = pcw.eventId
             LEFT JOIN rounds r ON r.eventId = e.id AND r.roundNumber = 1
             WHERE pcw.cartId = ?`,
            [item.id]
          );
          const workshopTotal = workshops.reduce((sum, w) => sum + (Number(w.registrationFees) || 0), 0);
          normalized.push({
            ...item,
            cost: workshopTotal,
            workshops,
          });
        } else {
          normalized.push(item);
        }
      }

      res.json(normalized);
    } catch (error) {
        console.error('Error fetching pass cart items:', error);
      res.status(500).json({ message: 'Failed to fetch pass cart items.' });
    }
  });

  // Remove item from cart
  router.delete('/:cartId', async (req, res) => {
    const { cartId } = req.params;

    try {
      await db.execute('DELETE FROM pass_cart_workshops WHERE cartId = ?', [cartId]);
      const [result] = await db.execute(
        'DELETE FROM pass_cart WHERE id = ?',
        [cartId]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: 'Cart item not found.' });
      }

      res.status(200).json({ message: 'Pass removed from cart successfully.' });
    } catch (error) {
      console.error('Error removing pass from cart:', error);
      res.status(500).json({ message: 'Failed to remove pass from cart.' });
    }
  });

  return router;
};
