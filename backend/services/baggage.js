
import Baggaes from "../models/baggage.js";

import { NotFoundError } from "../errors/notfound.js";

export const create = async (data) => {
  const baggage = await Baggaes.create(data);

  return baggage;
};

export const index = async (userId, tripId) => {
  const baggaes = await Baggaes.find({
    user: userId,
    trip: tripId
  });

  return baggaes;
};

export const find = async (id, userId, tripId) => {
  const baggage = await Baggaes.findOne({
    _id: id,
    user: userId,
    trip: tripId
  });

  if (!baggage) {
    throw new NotFoundError("Baggage not found");
  }

  return baggage;
};

export const update = async (id, data, userId, tripId) => {
  const baggage = await Baggaes.findOneAndUpdate(
    {
      _id: id,
      user: userId,
      trip: tripId
    },
    data,
    {
      new: true
    }
  );

  if (!baggage) {
    throw new NotFoundError("Baggage not found");
  }

  return baggage;
};

export const remove = async (id, userId, tripId) => {
  const baggage = await Baggaes.findOneAndDelete({
    _id: id,
    user: userId,
    trip: tripId
  });

  if (!baggage) {
    throw new NotFoundError("Baggage not found");
  }

  return baggage;
};

