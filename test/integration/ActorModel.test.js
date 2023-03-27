import { describe, it, before, after } from "mocha";
import { assert } from "chai";
import * as bcrypt from "bcrypt";
import Actor from "../../api/models/ActorModel.js";
import initMongoDBConnection from "../../api/config/mongoose.js";
import mongoose from "mongoose";

const actor = new Actor({
  name: "Mario",
  surname: "Ruano",
  email: "mruano@us.es",
  phone: "123456789",
  address: "calle dirección postal",
  preferredLanguage: "es",
  role: ["MANAGER"],
  banned: false,
  password: "M4r_/O"
});

describe("Testing Actor Model", () => {
  before(() => {
    return initMongoDBConnection();
  });

  before(async () => {
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash(actor.password, salt);
    actor.password = hash;
  });

  it("should return a success login", () => {
    actor.verifyPassword("M4r_/O", (_err, isMatch) => {
      assert.equal(isMatch, true);
    });
  });

  it("should create an actor", async () => {
    const actor = new Actor({
      name: "Mario",
      surname: "Ruano",
      email: "mrf1989@hotmail.com",
      phone: "123456789",
      address: "calle dirección postal",
      preferredLanguage: "es",
      role: ["EXPLORER"],
      banned: false,
      password: "M4r_/O"
    });

    const newActor = await actor.save();
    const actorRead = await Actor.find({ email: "mrf1989@hotmail.com" });
    assert.exists(newActor);
    assert.exists(actorRead);
  });

  it("should update an actor", async () => {
    const actorUpdated = await Actor.findOneAndUpdate({ email: "mrf1989@hotmail.com" }, {
      phone: "777666888",
      address: "helm street"
    }, { new: true });

    assert.equal(actorUpdated.phone, "777666888");
    assert.equal(actorUpdated.address, "helm street");
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });
});
