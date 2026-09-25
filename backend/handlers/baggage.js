
import { Router } from 'express';

import { create, index, find, update, remove } from '../services/baggage.js';

import { createBaggageValidator } from '../validators/baggage.js';

const router = Router({ mergeParams: true });

router.post('/', createBaggageValidator, async (req, res, next) => {
  try {
    const baggage = await create({
      ...req.body,
      user: req.user,
      trip: req.params.tripId
    });

    res.status(201).json(baggage);

  } catch (error) {
    next(error);
  }
});

// Get all baggages
router.get('/', async (req, res, next) => {
  try {
    const baggage = await index(req.user, req.params.tripId);

    res.status(200).json(baggage);

  } catch (error) {
    next(error);
  }
});

// Get baggage by ID
router.get('/:id', async (req, res, next) => {
  try {
    const baggage = await find(
      req.params.id,
      req.user,
      req.params.tripId
    );

    res.status(200).json(baggage);

  } catch (error) {
    next(error);
  }
});

// Update baggage
router.patch('/:id', async (req, res, next) => {
  try {
    const baggage = await update(
      req.params.id,
      req.body,
      req.user,
      req.params.tripId
    );

    res.status(200).json(baggage);

  } catch (error) {
    next(error);
  }
});

// Delete baggage
router.delete('/:id', async (req, res, next) => {
  try {
    await remove(
      req.params.id,
      req.user,
      req.params.tripId
    );

    res.status(204).send();

  } catch (error) {
    next(error);
  }
});

export default router;

