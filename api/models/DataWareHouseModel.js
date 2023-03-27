"use strict";
import mongoose from "mongoose";

const dataWareHouseSchema = new mongoose.Schema({
  tripsManagedByManager: [{
    averageTripsPerManager: Number,
    minTripsPerManager: Number,
    maxTripsPerManager: Number,
    stdDevTripsPerManager: Number
  }],
  applicationsPerTrip: [{
    averageApplicationsPerTrip: Number,
    minApplicationsPerTrip: Number,
    maxApplicationsPerTrip: Number,
    stdDevApplicationsPerTrip: Number
  }],
  tripsPrice: [{
    averagePrice: Number,
    minPrice: Number,
    maxPrice: Number,
    stdDevPrice: Number
  }],
  ratioApplicationsByStatus: [{
    _id: String,
    applications: Number
  }],
  averagePriceRange: [{
    averageMinPrice: Number,
    averageMaxPrice: Number
  }],
  topSearchedKeywords: [{
    _id: String,
    totalSearch: Number
  }],
  computationMoment: {
    type: Date,
    default: Date.now
  },
  rebuildPeriod: String
}, { strict: false });

dataWareHouseSchema.index({ computationMoment: -1 }, { expireAfterSeconds: 604801 });

const model = mongoose.model("DataWareHouse", dataWareHouseSchema);
export const schema = model.schema;
export default model;
