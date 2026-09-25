import { Router } from "express";

import {
  create,
  index,
  find,
  update,
  remove,
} from "../services/itinerary.js";

const router = Router();


// POST /itineraries
router.post("/", async (req, res, next) => {
  try {
    const itinerary = await create(
      req.body,
      req.user
    );

    res.status(201).json(itinerary);
  } catch (error) {
    next(error);
  }
});


// GET /itineraries/trip/:tripId
router.get("/trip/:tripId", async (req, res, next) => {
  try {
    const itineraries = await index(
      req.params.tripId,
      req.user
    );

    res.status(200).json(itineraries);
  } catch (error) {
    next(error);
  }
});


// GET /itineraries/:id
router.get("/:id", async (req, res, next) => {
  try {
    const itinerary = await find(
      req.params.id,
      req.user
    );

    res.status(200).json(itinerary);
  } catch (error) {
    next(error);
  }
});


// PATCH /itineraries/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const itinerary = await update(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json(itinerary);
  } catch (error) {
    next(error);
  }
});


// DELETE /itineraries/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const itinerary = await remove(
      req.params.id,
      req.user
    );

    res.status(200).json(itinerary);
  } catch (error) {
    next(error);
  }
});


export default router;