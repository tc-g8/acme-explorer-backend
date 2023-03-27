import mongoose from "mongoose";
import Trip from "../models/TripModel.js";
import { saveResultsToCache, getCachedResults } from "../services/CacheService.js";
import Configuration from "../models/ConfigurationModel.js";

export async function findById(req, res) {
  try {
    const trip = await Trip.findById(req.params.id);
    if (trip) {
      res.send(trip);
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

export async function updateTrip(req, res) {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (trip) {
      res.send(trip);
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

export async function deleteTrip(req, res) {
  try {
    const deletionResponse = await Trip.deleteOne({
      _id: req.params.id,
    });
    if (deletionResponse.deletedCount > 0) {
      res.sendStatus(204);
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

function _generateQuery(query) {
  const { keyword, minPrice, maxPrice, minDate, maxDate } = query;
  let finder = {};
  if (keyword) {
    finder = { $text: { $search: keyword } };
  }
  if (minPrice) {
    finder = { ...finder, price: { $gte: parseFloat(minPrice) } };
  }
  if (maxPrice) {
    finder = { ...finder, price: { $lte: parseFloat(maxPrice) } };
  }
  if (minDate) {
    finder = { ...finder, startDate: { $gte: minDate } };
  }
  if (maxDate) {
    finder = { ...finder, endDate: { $lte: maxDate } };
  }
  return finder;
}

const _findTrips = async (finder, explorerId) => {
  const trips = await Trip.find({
    ...finder,
    status: "PUBLISHED"
  });
  const cache = await saveResultsToCache(explorerId, trips);
  return cache.results;
};

export async function findTrips(req, res) {
  const finder = _generateQuery(req.query);
  const explorerId = req.query.explorerId;
  if (explorerId) {
    try {
      const trips = req.cachedResults ?
        await getCachedResults(explorerId) :
        await _findTrips(finder, explorerId);
      res.send(trips);
    } catch (err) {
      const trips = await _findTrips(finder, explorerId);
      if (trips) {
        res.send(trips);
      } else {
        res.status(500).send({
          message: res.__("UNEXPECTED_ERROR"),
          err
        });
      }
    }
  } else {
    const trips = await Trip.find({
      ...finder,
      status: "PUBLISHED"
    });

    res.send(trips);
  }
}

export async function addTrip(req, res) {
  const newTrip = new Trip(req.body);
  try {
    const trip = await newTrip.save();
    res.send(trip);
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

// Get all trips by manager_id
export async function findTripsByManagerId(req, res) {
  const { managerId } = req.params;
  try {
    const trips = await Trip.find({ manager_id: managerId });
    res.send(trips);
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

// Update the status of a trip to "PUBLISHED"
export async function publishTrip(req, res) {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id },
      {
        status: "PUBLISHED"
      },
      { new: true }
    );

    if (trip) {
      res.send(trip);
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

// Update the status of a trip to "CANCELLED"
export async function cancelTrip(req, res) {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id },
      {
        status: "CANCELLED",
        cancelationReason: req.body.cancelationReason
      },
      { new: true }
    );

    if (trip) {
      res.send(trip);
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

// Add a sponsorship to a trip
export async function addStage(req, res) {
  try {
    const trip = await Trip.findById(req.params.id);
    const newStage = {
      "title": req.body.title,
      "description": req.body.description,
      "price": req.body.price
    }
    trip.stages.push(newStage);

    await trip.save();

    if (trip) {
      res.send(trip);
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

// Update a stage from a trip
export async function updateTripStage(req, res) {
  try {
    // Get trip by id
    const trip = await Trip.findById(req.params.tripId);
    if (trip) {
      // Get stage by id
      const stage = trip.stages.filter(stage => stage._id.equals(new mongoose.Types.ObjectId(req.params.stageId)))[0];
      if (stage) {
        // Get index of stage
        const stageIndex = trip.stages.indexOf(stage)
        // Update and save sponsorship
        stage.title = req.body.title
        stage.description = req.body.description
        stage.price = req.body.price
        trip.stages[stageIndex] = stage
        trip.save()
        res.send(trip);
      } else {
        res.status(404).send({
          message: res.__("STAGE_NOT_FOUND")
        });
      }
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

// Returns all the sponsorships of the sponsor passed by parameters
export async function findSponsorshipsBySponsorId(req, res) {
  try {
    const sponsorshipList = await Trip.aggregate([
      {
        '$unwind': {
          'path': '$sponsorships'
        }
      }, {
        '$match': {
          'sponsorships.sponsor_id': new mongoose.Types.ObjectId(req.params.id)
        }
      }, {
        '$project': {
          '_id': 0,
          'sponsorship': '$sponsorships'
        }
      }
    ]);

    if (sponsorshipList.length === 0) {
      res.status(404).send({
        message: res.__("NO_SPONSORSHIPS")
      });
    } else {
      let sponsorshipsqs = [];
      sponsorshipList.forEach(sponsorship => sponsorshipsqs.push(sponsorship.sponsorship))
      res.send(sponsorshipsqs)
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

// Return the sponsorship passed by parameters
export async function getTripSponsorshipById(req, res) {
  try {
    const sponsorship = await Trip.aggregate([
      {
        '$unwind': {
          'path': '$sponsorships'
        }
      }, {
        '$match': {
          'sponsorships._id': new mongoose.Types.ObjectId(req.params.id)
        }
      }, {
        '$project': {
          'sponsorship': '$sponsorships',
          '_id': 0
        }
      }
    ]);

    if (sponsorship[0].sponsorship) {
      res.send(sponsorship[0].sponsorship)
    } else {
      res.status(404).send({
        message: res.__("SPONSORSHIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

// Add a sponsorship to a trip
export async function addSponsorship(req, res) {
  try {
    const configurations = await Configuration.find({});
    const trip = await Trip.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.params.id)
      },
      {
        $push: {
          "sponsorships": {
            "banner": req.body.banner,
            "landingPage": req.body.landingPage,
            "amount": configurations[0].sponsorshipPrice,
            "status": "PENDING",
            "sponsor_id": req.body.sponsor_id
          }
        }
      },
      {
        new: true
      }
    );

    if (trip) {
      res.send(trip);
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

// Update a sponsorship from a trip
export async function updateTripSponsorship(req, res) {
  try {
    // Get trip by id
    const trip = await Trip.findById(req.params.tripId);
    if (trip) {
      // Get sponsorship by id
      const sponsorship = trip.sponsorships.filter(sponsorship => sponsorship._id.equals(new mongoose.Types.ObjectId(req.params.sponsorshipId)))[0];
      if (sponsorship) {
        // Get index of sponsorship
        const sponsorshipIndex = trip.sponsorships.indexOf(sponsorship)
        // Update and save sponsorship
        if (req.body.banner) {
          sponsorship.banner = req.body.banner
        }
        if (req.body.landingPage) {
          sponsorship.landingPage = req.body.landingPage
        }
        trip.sponsorships[sponsorshipIndex] = sponsorship
        trip.save()
        res.send(trip);
      } else {
        res.status(404).send({
          message: res.__("SPONSORSHIP_NOT_FOUND")
        });
      }
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

// Update status from a sponsorship
export async function deleteTripSponsorshipLogically(req, res) {
  try {
    // Get trip by id
    const trip = await Trip.findById(req.params.tripId);
    if (trip) {
      // Get sponsorship by id
      const sponsorship = trip.sponsorships.filter(sponsorship => sponsorship._id.equals(new mongoose.Types.ObjectId(req.params.sponsorshipId)))[0];
      if (sponsorship) {
        // Get index of sponsorship
        const sponsorshipIndex = trip.sponsorships.indexOf(sponsorship)
        // Update and save sponsorship
        sponsorship.status = "CANCELLED"
        trip.sponsorships[sponsorshipIndex] = sponsorship
        trip.save()
        res.send(trip);
      } else {
        res.status(404).send({
          message: res.__("SPONSORSHIP_NOT_FOUND")
        });
      }
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

export async function paySponsorship(req, res) {
  try {
    // Get trip by id
    const trip = await Trip.findById(req.params.tripId);
    if (trip) {
      // Get sponsorship by id
      const sponsorship = trip.sponsorships.filter(sponsorship => sponsorship._id.equals(new mongoose.Types.ObjectId(req.params.sponsorshipId)))[0];
      if (sponsorship) {
        // Get index of sponsorship
        const sponsorshipIndex = trip.sponsorships.indexOf(sponsorship)
        // Update and save sponsorship
        sponsorship.status = 'ACCEPTED'
        trip.sponsorships[sponsorshipIndex] = sponsorship
        trip.save()
        res.send(trip);
      } else {
        res.status(404).send({
          message: res.__("SPONSORSHIP_NOT_FOUND")
        });
      }
    } else {
      res.status(404).send({
        message: res.__("TRIP_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}