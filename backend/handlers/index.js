import { Router } from 'express';

import USER_ROUTER from './user.js';
import AUTH_ROUTER from './auth.js';
import TRIP_ROUTER from './trip.js';
import BAGGAGE_ROUTER from './baggage.js';
import ITINERARY_ROUTER from './itinerary.js';

const router = Router({ mergeParams: true });

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Wander Wise API'
  });
});

router.use('/users', USER_ROUTER);

router.use('/auth', AUTH_ROUTER);

router.use('/trips', TRIP_ROUTER);

router.use('/:tripId/baggages', BAGGAGE_ROUTER);

router.use('/itineraries', ITINERARY_ROUTER);

export default router;