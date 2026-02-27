const express = require('express');
const router = express.Router();

module.exports = function (db) {
  const isWorkshopPassName = (name) => String(name || '').toLowerCase().includes('workshop pass');
  const isSpecialPassName = (name) => {
    const n = String(name || '').toLowerCase();
    return n.includes('special event pass') || n.includes('special pass') || n.includes('special event') || n.includes('elite pass');
  };
  const isGlobalPassName = (name) => String(name || '').toLowerCase().includes('global');
  const isTechPassName = (name) => {
    const n = String(name || '').toLowerCase();
    return n.includes('tech pass') && !n.includes('non-tech') && !n.includes('non tech') && !n.includes('nontech');
  };
  const isNonTechPassName = (name) => {
    const n = String(name || '').toLowerCase();
    return n.includes('non-tech pass') || n.includes('non tech pass') || n.includes('nontech pass');
  };

  // Add item to cart
  router.post('/', async (req, res) => {
    const { userEmail, eventId, symposiumName } = req.body;

    if (!userEmail || !eventId || !symposiumName) {
      return res.status(400).json({ message: 'Missing required cart fields.' });
    }

    try {
      // Check if already registered
      const [existingRegistration] = await db.execute(
        'SELECT id FROM registrations WHERE userEmail = ? AND eventId = ?',
        [userEmail, eventId]
      );

      if (existingRegistration.length > 0) {
        return res.status(409).json({ message: 'You have already registered for this event.' });
      }

      // Find the user by email to get their ID
      const [users] = await db.execute('SELECT id FROM users WHERE email = ?', [userEmail]);

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const userId = users[0].id;

      // Check if the item is already in the cart for this user
      const [existingCartItem] = await db.execute(
        'SELECT * FROM cart WHERE userId = ? AND eventId = ? AND symposiumName = ?',
        [userId, eventId, symposiumName]
      );

      if (existingCartItem.length > 0) {
        return res.status(409).json({ message: 'Event already in cart.' });
      }

      await db.execute(
        'INSERT INTO cart (userId, eventId, symposiumName) VALUES (?, ?, ?)',
        [userId, eventId, symposiumName]
      );

      res.status(201).json({ message: 'Event added to cart successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add event to cart.' });
    }
  });

  // Get cart items for a user
  router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      // Get user email
      const [users] = await db.execute('SELECT email FROM users WHERE id = ?', [userId]);
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const userEmail = users[0].email;

      // Get registered event and pass IDs
      const [registeredItems] = await db.execute(
        'SELECT eventId, passId FROM registrations WHERE userEmail = ?',
        [userEmail]
      );
      const registeredEventIds = registeredItems.map(item => item.eventId).filter(id => id !== null);
      const registeredPassIds = registeredItems.map(item => item.passId).filter(id => id !== null);

      // Fetch event cart items and filter out registered ones
      const [eventCartItems] = await db.execute(
        'SELECT cartId, eventId, symposiumName FROM cart WHERE userId = ?',
        [userId]
      );
      const filteredEventCartItems = eventCartItems.filter(item => !registeredEventIds.includes(item.eventId));

      const eventsWithDetails = await Promise.all(
        filteredEventCartItems.map(async (item) => {
          const eventTable = 'events';

          // [UPDATED] Added discountPercentage, mit_discount_percentage and discountReason to the SELECT query
          const [eventDetails] = await db.execute(
            `SELECT eventName, eventCategory, eventDescription, registrationFees, lastDateForRegistration, coordinatorName, coordinatorContactNo, discountPercentage, mit_discount_percentage, discountReason 
             FROM ${eventTable} WHERE id = ?`,
            [item.eventId]
          );

          if (eventDetails.length > 0) {
            return { ...item, type: 'event', eventDetails: eventDetails[0] };
          }
          return null;
        })
      );

      // Fetch pass cart items and filter out registered ones
      const [passCartItems] = await db.execute(
        `SELECT pc.id as cartId, pc.passId, p.name as passName
         FROM pass_cart pc
         JOIN passes p ON p.id = pc.passId
         WHERE pc.userId = ?`,
        [userId]
      );
      const filteredPassCartItems = passCartItems.filter(item => {
        if (isWorkshopPassName(item.passName) || isSpecialPassName(item.passName)) {
          return true;
        }
        return !registeredPassIds.includes(item.passId);
      });

      const passesWithDetails = await Promise.all(
        filteredPassCartItems.map(async (item) => {
          const [passDetails] = await db.execute(
            'SELECT name, cost, description FROM passes WHERE id = ?',
            [item.passId]
          );

          if (passDetails.length > 0) {
            const pass = passDetails[0];
            if (isWorkshopPassName(pass.name)) {
              const [workshops] = await db.execute(
                `SELECT e.id as eventId, e.eventName, e.registrationFees, r.roundDateTime
                 FROM pass_cart_workshops pcw
                 JOIN events e ON e.id = pcw.eventId
                 LEFT JOIN rounds r ON r.eventId = e.id AND r.roundNumber = 1
                 WHERE pcw.cartId = ?`,
                [item.cartId]
              );
              const workshopTotal = workshops.reduce((sum, w) => sum + (Number(w.registrationFees) || 0), 0);
              return {
                ...item,
                type: 'pass',
                passDetails: { ...pass, cost: workshopTotal },
                workshops
              };
            }
            if (isSpecialPassName(pass.name)) {
              const [specialEvents] = await db.execute(
                `SELECT e.id as eventId, e.eventName, e.registrationFees
                 FROM pass_cart_special_events pcs
                 JOIN events e ON e.id = pcs.eventId
                 WHERE pcs.cartId = ?`,
                [item.cartId]
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
              let specialCost = Number(pass.cost) || 0;
              if (specialEvents.length === 1) {
                if (existingSpecialFeesTotal > 0) {
                  specialCost = Math.max((Number(pass.cost) || 0) - existingSpecialFeesTotal, 0);
                } else {
                  specialCost = Number(specialEvents[0].registrationFees) || 0;
                }
              } else if (specialEvents.length >= 2) {
                specialCost = Number(pass.cost) || 0;
              }
              return {
                ...item,
                type: 'pass',
                passDetails: { ...pass, cost: specialCost },
                specialEvents
              };
            }
            if (isGlobalPassName(pass.name)) {
              const [registeredPassRows] = await db.execute(
                `SELECT p.id, p.cost, p.name
                 FROM registrations r
                 JOIN passes p ON p.id = r.passId
                 WHERE r.userId = ? AND r.passId IS NOT NULL`,
                [userId]
              );
              const registeredTech = registeredPassRows.filter((row) => isTechPassName(row.name));
              const registeredNonTech = registeredPassRows.filter((row) => isNonTechPassName(row.name));
              const alreadyPaid = [...registeredTech, ...registeredNonTech]
                .reduce((sum, row) => sum + (Number(row.cost) || 0), 0);
              const globalCost = Math.max((Number(pass.cost) || 0) - alreadyPaid, 0);
              return {
                ...item,
                type: 'pass',
                passDetails: { ...pass, cost: globalCost },
                passEvents: []
              };
            }
            const [passEvents] = await db.execute(
              `SELECT e.id as eventId, e.eventName
               FROM pass_events pe
               JOIN events e ON e.id = pe.eventId
               WHERE pe.passId = ?`,
              [item.passId]
            );
            return { ...item, type: 'pass', passDetails: pass, passEvents };
          }
          return null;
        })
      );

      // Fetch accommodation cart items
      const [accommodationCartItems] = await db.execute(
        'SELECT id as cartId, gender, quantity FROM accommodation_cart WHERE userId = ?',
        [userId]
      );

      // Check if user has a confirmed accommodation booking
      const [accommodationBookings] = await db.execute(
        'SELECT id FROM accommodation_bookings WHERE userId = ? AND status = ?',
        [userId, 'confirmed']
      );

      const accommodationWithDetails = await Promise.all(
        accommodationCartItems
          .filter(item => accommodationBookings.length === 0) // Filter if already booked
          .map(async (item) => {
            const [accommodationDetails] = await db.execute(
              'SELECT fees FROM accommodation WHERE gender = ?',
              [item.gender]
            );

            if (accommodationDetails.length > 0) {
              return {
                ...item,
                type: 'accommodation',
                accommodationDetails: {
                  name: `Accommodation (${item.gender})`,
                  cost: accommodationDetails[0].fees,
                  quantity: item.quantity
                }
              };
            }
            return null;
          })
      );

      const allCartItems = [
        ...eventsWithDetails.filter(item => item !== null),
        ...passesWithDetails.filter(item => item !== null),
        ...accommodationWithDetails.filter(item => item !== null)
      ];

      res.json(allCartItems);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      res.status(500).json({ message: 'Failed to fetch cart items.' });
    }
  });

  // Remove item from cart
  router.delete('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    const { userEmail } = req.body; // Expect userEmail for verification

    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required.' });
    }

    try {
      const [users] = await db.execute('SELECT id FROM users WHERE email = ?', [userEmail]);

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const userId = users[0].id;

      const [result] = await db.execute(
        'DELETE FROM cart WHERE cartId = ? AND userId = ?',
        [cartId, userId]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: 'Cart item not found or not authorized.' });
      }

      res.status(200).json({ message: 'Event removed from cart successfully.' });
    } catch (error) {
      console.error('Error removing event from cart:', error);
      res.status(500).json({ message: 'Failed to remove event from cart.' });
    }
  });

  return router;
};
