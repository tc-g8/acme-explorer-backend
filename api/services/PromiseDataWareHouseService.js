"use strict";
import cron from "cron";
import DataWareHouse from "../models/DataWareHouseModel.js";
import Trip from "../models/TripModel.js";
import Application from "../models/ApplicationModel.js";
import Finder from "../models/FinderModel.js";
import mongoose from "mongoose";

let defaultPeriod = "*/10 * * * * *";
let dataWarehouseJob;

const buildNewDataWarehouse = (resultsDataWarehouse, period) => {
  const newDataWareHouse = new DataWareHouse();
  const [
    tripsManagedByManager,
    applicationsPerTrip,
    tripsPrice,
    ratioApplicationsByStatus,
    averagePriceRange,
    topSearchedKeywords
  ] = resultsDataWarehouse;
  newDataWareHouse.tripsManagedByManager = tripsManagedByManager;
  newDataWareHouse.applicationsPerTrip = applicationsPerTrip;
  newDataWareHouse.tripsPrice = tripsPrice;
  newDataWareHouse.ratioApplicationsByStatus = ratioApplicationsByStatus;
  newDataWareHouse.averagePriceRange = averagePriceRange;
  newDataWareHouse.topSearchedKeywords = topSearchedKeywords;
  newDataWareHouse.rebuildPeriod = period;
  return newDataWareHouse;
};

const initializeDataWarehouseJob = () => {
  dataWarehouseJob = new cron.CronJob(defaultPeriod, async () => {
    console.log("Cron job submitted. Rebuild period: " + defaultPeriod);
    try {
      const dataWarehouseResults = await Promise.all([
        computeTripsManagedByManagers(),
        computeApplicationsPerTrip(),
        computeTripsPrice(),
        computeRatioApplicationsByStatus(),
        computeAveragePriceRange(),
        computeTopSearchedKeywords()
      ]);
      const newDataWareHouse = buildNewDataWarehouse(dataWarehouseResults, defaultPeriod);
      try {
        newDataWareHouse.save();
        console.log("new DataWareHouse succesfully saved. Date: " + new Date());
      } catch (err) {
        console.log("Error saving datawarehouse: " + err);
      }
    } catch (err) {
      console.log("Error computing datawarehouse: " + err);
    }
  }, null, true, "Europe/Madrid");
};

const restartDataWarehouseJob = (period) => {
  defaultPeriod = period;
  dataWarehouseJob.setTime(new cron.CronTime(period));
  dataWarehouseJob.start();
};

const computeTripsManagedByManagers = async () => {
  const tripsManagedByManager = await Trip.aggregate([
    {
      $facet: {
        managers: [{
          $group: { _id: "$manager_id" }
        },
        {
          $group: { _id: null, totalManagers: { $sum: 1 } }
        }],
        trips: [
          { $group: { _id: null, totalTrips: { $sum: 1 } } }
        ],
        tripsPerManager: [
          { $group: { _id: "$manager_id", numTripsPerManager: { $sum: 1 } } }
        ]
      }
    },
    {
      $project: {
        averageTripsPerManager: {
          $divide: [
            { $arrayElemAt: ["$trips.totalTrips", 0] },
            { $arrayElemAt: ["$managers.totalManagers", 0] }
          ]
        },
        minTripsPerManager: {
          $min: "$tripsPerManager.numTripsPerManager"
        },
        maxTripsPerManager: {
          $max: "$tripsPerManager.numTripsPerManager"
        },
        stdDevTripsPerManager: {
          $stdDevSamp: "$tripsPerManager.numTripsPerManager"
        }
      }
    }
  ]);
  return tripsManagedByManager;
};

const computeApplicationsPerTrip = async () => {
  const applicationsPerTrip = await Application.aggregate([
    {
      $facet: {
        trips: [{
          $group: { _id: "$trip_id" }
        },
        {
          $group: { _id: null, totalTrips: { $sum: 1 } }
        }],
        applications: [
          { $group: { _id: null, totalApplications: { $sum: 1 } } }
        ],
        applicationsPerTrip: [
          { $group: { _id: "$trip_id", numApplicationPerTrips: { $sum: 1 } } }
        ]
      }
    },
    {
      $project: {
        averageApplicationsPerTrip: {
          $divide: [
            { $arrayElemAt: ["$applications.totalApplications", 0] },
            { $arrayElemAt: ["$trips.totalTrips", 0] }
          ]
        },
        minApplicationsPerTrip: {
          $min: "$applicationsPerTrip.numApplicationPerTrips"
        },
        maxApplicationsPerTrip: {
          $max: "$applicationsPerTrip.numApplicationPerTrips"
        },
        stdDevApplicationsPerTrip: {
          $stdDevSamp: "$applicationsPerTrip.numApplicationPerTrips"
        }
      }
    }
  ]);
  return applicationsPerTrip;
};

const computeTripsPrice = async () => {
  const tripsPrice = await Trip.aggregate([
    {
      $group: {
        _id: null,
        totalTrips: { $sum: 1 },
        totalPrice: { $sum: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        stdDevTripPrice: { $stdDevSamp: "$price" }
      }
    },
    {
      $project: {
        _id: 0,
        averagePrice: { $divide: ["$totalPrice", "$totalTrips"] },
        minPrice: "$minPrice",
        maxPrice: "$maxPrice",
        stdDevPrice: "$stdDevTripPrice"
      }
    }]);
  return tripsPrice;
};

const computeRatioApplicationsByStatus = async () => {
  const ratioApplicationsByStatus = await Application.aggregate([
    { $group: { _id: "$status", applications: { $sum: 1 } } }
  ]);
  return ratioApplicationsByStatus;
};

const computeAveragePriceRange = async () => {
  const averagePriceRange = await Finder.aggregate([
    {
      $group: {
        _id: null,
        averageMinPrice: { $avg: "$minPrice" },
        averageMaxPrice: { $avg: "$maxPrice" }
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ]);
  return averagePriceRange;
};

const computeTopSearchedKeywords = async () => {
  const topSearchedKeywords = await Finder.aggregate([
    {
      $group: {
        _id: "$keyword",
        totalSearch: { $sum: 1 }
      }
    },
    {
      $sort: { totalSearch: -1 }
    },
    {
      $limit: 10
    },
  ]);
  return topSearchedKeywords;
};

const amountSpentByExplorer = async ({ explorerId, startDate, endDate }) => {
  const amountSpentByExplorer = await Application.aggregate([
    {
      $match: {
        explorer_id: new mongoose.Types.ObjectId(explorerId),
        status: "ACCEPTED",
        paidAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate)
        }
      }
    }, {
      $lookup: {
        from: "trips",
        localField: "trip_id",
        foreignField: "_id",
        as: "trip"
      }
    }, {
      $unwind: {
        path: "$trip",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $group: {
        _id: 0,
        amount: {
          $sum: "$trip.price"
        }
      }
    }, {
      $project: {
        _id: 0
      }
    }
  ]);
  return amountSpentByExplorer[0];
};

const explorersByAmountSpent = async ({ startDate, endDate, v, theta }) => {
  let operation = {};

  switch (theta) {
    case "gt":
      operation = { $gt: v };
      break;
    case "gte":
      operation = { $gte: v };
      break;
    case "lt":
      operation = { $lt: v };
      break;
    case "lte":
      operation = { $lte: v };
      break;
    case "eq":
      operation = { $eq: v };
      break;
    default:
      operation = { $eq: v };
      break;
  }

  const explorersByAmountSpent = await Application.aggregate([
    {
      $match: {
        status: "ACCEPTED",
        paidAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate)
        }
      }
    }, {
      $lookup: {
        from: "trips",
        localField: "trip_id",
        foreignField: "_id",
        as: "trip"
      }
    }, {
      $unwind: {
        path: "$trip",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $group: {
        _id: "$explorer_id",
        amount: {
          $sum: "$trip.price"
        }
      }
    },
    {
      $match: {
        amount: operation
      }
    }
  ]);
  return explorersByAmountSpent;
};

export {
  initializeDataWarehouseJob,
  restartDataWarehouseJob,
  amountSpentByExplorer,
  explorersByAmountSpent
};
