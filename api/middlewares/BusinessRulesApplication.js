import Application from "../models/ApplicationModel.js";
import Trip from "../models/TripModel.js";

export const checkApplicationExists = async (req, res, next) => {
  const application = await Application.findOne({
    trip_id: req.body.trip_id,
    explorer_id: req.body.explorer_id
  });
  if (application) {
    res.status(400).send({ message: "Application already exists" });
  } else {
    next();
  }
};

export const checkInvalidTrip = async (req, res, next) => {
  const trip = await Trip.findOne({ _id: req.body.trip_id });
  if (!trip || trip.startDate <= Date.now() || trip.status === "CANCELLED") {
    res.status(400).send({ message: "Trip is not available" });
  } else {
    next();
  }
};
