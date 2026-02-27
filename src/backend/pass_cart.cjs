const express = require('express');
const router = express.Router();

module.exports = function (db) {
  const isWorkshopPassName = (name) => String(name || '').toLowerCase().includes('workshop pass');
  const isSpecialPassName = (name) => {
    const n = String(name || '').toLowerCase();
    return n.includes('special event pass') || n.includes('special pass') || n.includes('special event') || n.includes('elite pass');
  };
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

  async function validateSpecialSelections(passId, eventIds) {
    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return { ok: false, message: 'Please select at least one special event.' };
    }

    const uniqueEventIds = [...new Set(eventIds.map((id) => Number(id)).filter((id) => !Number.isNaN(id)))];
    if (uniqueEventIds.length === 0) {
      return { ok: false, message: 'Invalid special event selection.' };
    }

    if (uniqueEventIds.length > 2) {
      return { ok: false, message: 'You can select up to two special events.' };
    }

    const placeholders = uniqueEventIds.map(() => '?').join(',');
    const [mappedRows] = await db.execute(
      `SELECT eventId FROM pass_events WHERE passId = ? AND eventId IN (${placeholders})`,
      [passId, ...uniqueEventIds]
    );
    if (mappedRows.length !== uniqueEventIds.length) {
      return { ok: false, message: 'One or more selected events are not part of this pass.' };
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
      const isSpecialPass = isSpecialPassName(pass.name);
      let workshopEventIds = null;
      let specialEventIds = null;

      if (isWorkshopPass) {
        const selectionCheck = await validateWorkshopSelections(passId, eventIds);
        if (!selectionCheck.ok) {
          return res.status(400).json({ message: selectionCheck.message });
        }
        workshopEventIds = selectionCheck.eventIds;
      }
      if (isSpecialPass) {
        const selectionCheck = await validateSpecialSelections(passId, eventIds);
        if (!selectionCheck.ok) {
          return res.status(400).json({ message: selectionCheck.message });
        }
        specialEventIds = selectionCheck.eventIds;
      }

      // Get user email
      const [users] = await db.execute('SELECT email FROM users WHERE id = ?', [userId]);
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const userEmail = users[0].email;

      if (isWorkshopPass) {
        const [existingWorkshopRows] = await db.execute(
          'SELECT eventId FROM workshop_pass_registrations WHERE userId = ? AND passId = ?',
          [userId, passId]
        );
        const existingWorkshopIds = new Set(existingWorkshopRows.map((row) => Number(row.eventId)));
        const newWorkshopIds = (workshopEventIds || []).filter((id) => !existingWorkshopIds.has(Number(id)));
        if (newWorkshopIds.length === 0) {
          return res.status(409).json({ message: 'You have already registered for the selected workshops.' });
        }
        workshopEventIds = newWorkshopIds;
      } else if (isSpecialPass) {
        const [existingSpecialRows] = await db.execute(
          'SELECT eventId FROM special_pass_registrations WHERE userId = ? AND passId = ?',
          [userId, passId]
        );
        const existingSpecialIds = new Set(existingSpecialRows.map((row) => Number(row.eventId)));
        const newSpecialIds = (specialEventIds || []).filter((id) => !existingSpecialIds.has(Number(id)));
        if (newSpecialIds.length === 0) {
          return res.status(409).json({ message: 'You have already registered for the selected events.' });
        }
        specialEventIds = newSpecialIds;
      } else {
        // Check if already registered for non-selectable passes
        const [existingRegistration] = await db.execute(
          'SELECT id FROM registrations WHERE userEmail = ? AND passId = ?',
          [userEmail, passId]
        );
        if (existingRegistration.length > 0) {
          return res.status(409).json({ message: 'You have already purchased this pass.' });
        }
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
        if (workshopEventIds && workshopEventIds.length > 0) {
          const values = workshopEventIds.map(() => '(?, ?)').join(', ');
          const params = workshopEventIds.flatMap((id) => [insertResult.insertId, id]);
          await db.execute(
            `INSERT INTO pass_cart_workshops (cartId, eventId) VALUES ${values}`,
            params
          );
        }
      }
      if (isSpecialPass) {
        if (specialEventIds && specialEventIds.length > 0) {
          const values = specialEventIds.map(() => '(?, ?)').join(', ');
          const params = specialEventIds.flatMap((id) => [insertResult.insertId, id]);
          await db.execute(
            `INSERT INTO pass_cart_special_events (cartId, eventId) VALUES ${values}`,
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
        } else if (isSpecialPassName(item.name)) {
          const [specialEvents] = await db.execute(
            `SELECT e.id as eventId, e.eventName, e.registrationFees
             FROM pass_cart_special_events pcs
             JOIN events e ON e.id = pcs.eventId
             WHERE pcs.cartId = ?`,
            [item.id]
          );
          const [existingSpecialRows] = await db.execute(
            `SELECT e.registrationFees
             FROM special_pass_registrations spr
             JOIN events e ON e.id = spr.eventId
             WHERE spr.userId = ? AND spr.passId = ?`,
            [userId, item.passId]
          );
          const existingSpecialFeesTotal = existingSpecialRows.reduce(
            (sum, row) => sum + (Number(row.registrationFees) || 0),
            0
          );
          let specialCost = Number(item.cost) || 0;
          if (specialEvents.length === 1) {
            if (existingSpecialFeesTotal > 0) {
              specialCost = Math.max((Number(item.cost) || 0) - existingSpecialFeesTotal, 0);
            } else {
              specialCost = Number(specialEvents[0].registrationFees) || 0;
            }
          } else if (specialEvents.length >= 2) {
            specialCost = Number(item.cost) || 0;
          }
          normalized.push({
            ...item,
            cost: specialCost,
            specialEvents,
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
      await db.execute('DELETE FROM pass_cart_special_events WHERE cartId = ?', [cartId]);
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
