import Itinerary from "../models/itinerary.js";
import Trip from "../models/trip.js";
import { NotFoundError } from "../errors/notfound.js";


// Create itinerary
export const create = async (data, userId) => {
  const trip = await Trip.findOne({
    _id: data.trip,
    user: userId,
  });

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  const itinerary = await Itinerary.create({
    trip: data.trip,
    title: data.title,
    date: data.date,
    activities: data.activities || [],
  });

  return itinerary;
};


// Get all itineraries for one trip
export const index = async (tripId, userId) => {
  const trip = await Trip.findOne({
    _id: tripId,
    user: userId,
  });

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  const itineraries = await Itinerary.find({
    trip: tripId,
  }).sort({ date: 1 });

  return itineraries;
};


// Get one itinerary
export const find = async (id, userId) => {
  const itinerary = await Itinerary.findById(id).populate("trip");

  if (!itinerary) {
    throw new NotFoundError("Itinerary not found");
  }

  if (!itinerary.trip) {
    throw new NotFoundError("Trip not found");
  }

  if (itinerary.trip.user.toString() !== userId.toString()) {
    throw new NotFoundError("Itinerary not found");
  }

  return itinerary;
};


// Update itinerary
export const update = async (id, data, userId) => {
  const itinerary = await find(id, userId);

  itinerary.title = data.title;
  itinerary.date = data.date;
  itinerary.activities = data.activities || [];

  await itinerary.save();

  return itinerary;
};


// Delete itinerary
export const remove = async (id, userId) => {
  const itinerary = await find(id, userId);

  await Itinerary.findByIdAndDelete(id);

  return itinerary;
};