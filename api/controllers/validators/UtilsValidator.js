import Trip from "../../models/TripModel.js"

const isFloat = async (value) => {
  try {
    if (((Number.isInteger(value) && Number(value) % 1 === 0) ||
      (!Number.isInteger(value) && Number(value) % 1 !== 0)) &&
      Number(value) >= 0) {
      return Promise.resolve("Value is OK");
    } else {
      return Promise.reject(new Error("Value is invalid"));
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

const startDateBeforeEndDate = async (startDate, { req }) => {
  if (req.body.endDate == undefined) {
    const trip = await Trip.findById(req.params.id);
    if (startDate > trip.endDate.toISOString().split('T')[0]) {
      throw new Error('Start date must be before end date');
    }
    return true
  } else {
    if (startDate > req.body.endDate) {
      throw new Error('Start date must be before end date');
    }
    return true
  }
};

const endDateBeforeStartDate = async (endDate, { req }) => {
  if (req.body.startDate == undefined) {
    const trip = await Trip.findById(req.params.id);
    if (endDate < trip.startDate.toISOString().split('T')[0]) {
      throw new Error('End date must be after start date');
    }
    return true
  } else {
    if (endDate < req.body.startDate) {
      throw new Error('End date must be after start date');
    }
    return true
  }
};

export { isFloat, startDateBeforeEndDate, endDateBeforeStartDate };