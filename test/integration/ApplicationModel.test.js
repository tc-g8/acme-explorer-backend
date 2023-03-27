import { describe, it, before, after } from "mocha";
import { assert } from "chai";
import Trip from "../../api/models/TripModel.js";
import Actor from "../../api/models/ActorModel.js";
import Application from "../../api/models/ApplicationModel.js";
import initMongoDBConnection from "../../api/config/mongoose.js";
import mongoose from "mongoose";

describe("Testing Application Model", () => {
  before(() => {
    return initMongoDBConnection();
  });

  before(async () => {
    const actor = {
      name: "Mario",
      surname: "Ruano",
      phone: "123456789",
      address: "calle dirección postal",
      preferredLanguage: "es",
      banned: false,
      password: "M4r_/O"
    };
    const actorManager = new Actor({
      ...actor,
      email: "mrf1989@hotmail.com",
      role: ["MANAGER"]
    });

    const actorSponsor = new Actor({
      ...actor,
      email: "abc1234@hotmail.com",
      role: ["SPONSOR"]
    });

    const actorExplorer = new Actor({
      ...actor,
      email: "000123@hotmail.com",
      role: ["EXPLORER"]
    });

    await actorManager.save();
    await actorSponsor.save();
    await actorExplorer.save();

    const trip = new Trip({
      title: "Sample Trip",
      description: "Lorem ipsum a trip triporium",
      requirements: [],
      startDate: "2023-04-06T00:01:15.533Z",
      endDate: "2023-04-09T00:01:15.533Z",
      stages: [
        {
          title: "Sample stage 1",
          description: "Lorem ipsum a stage stegium",
          price: 29.95
        },
        {
          title: "Sample stage 2",
          description: "Lorem ipsum a stage stegium",
          price: 34.90
        }
      ],
      sponsorships: [
        {
          banner: {
            data: "",
            contentType: ""
          },
          landingPage: "http://xyz.abc",
          amount: 500.0,
          sponsor_id: actorSponsor._id
        }
      ],
      manager_id: actorManager._id
    });

    await trip.save();
  });

  it("should create an application", async () => {
    const actor = await Actor.findOne({ email: "000123@hotmail.com" });
    const trip = await Trip.find({});
    const application = new Application({
      comment: "Lorem ipsum comentarium dixit",
      trip_id: trip[0]._id,
      explorer_id: actor._id
    });

    const newTrip = await application.save();

    assert.exists(newTrip);
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });
});
