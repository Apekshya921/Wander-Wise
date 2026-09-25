import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },

    activity: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    activities: {
      type: [activitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;