/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../../app.js";
import Actor from "../../api/models/ActorModel.js";

const { expect } = chai;
chai.use(chaiHttp);

const actorOK = {
  name: "Mario",
  surname: "Ruano",
  email: "mruano@us.es",
  role: ["MANAGER"],
  password: "M4r_/O123abc"
};

const actorBadPassword = {
  name: "Mario",
  surname: "Ruano",
  email: "mruano@us.es",
  role: ["MANAGER"],
  password: "12345678"
};

const actorInDB = {
  ...actorOK,
  phone: "123456789",
  address: "happy road st",
  preferredLanguage: "es",
  banned: false,
};

const actorToUpdate = {
  name: "Mario",
  surname: "Ruano",
  email: "mruano@us.es",
  role: ["MANAGER"],
  phone: "123456789",
  address: "happy road st",
  preferredLanguage: "es",
};

const actorUpdated = {
  phone: "776111989",
  address: "helm street"
};

describe("Actor Controller test", () => {
  it("POST actor", (done) => {
    const stubFindOne = sinon.stub(Actor, "findOne").returns(Promise.resolve(undefined));
    const stubSave = sinon.stub(Actor.prototype, "save").returns(Promise.resolve(JSON.stringify(actorOK)));
    chai.request(app)
      .post("/api/v1/actors")
      .send(actorOK)
      .end((_err, res) => {
        expect(stubFindOne.calledOnce).to.be.true;
        expect(stubSave.calledOnce).to.be.true;
        expect(res).to.have.status(200);
        expect("Content-Type", /json/);
        done();
      });
  });

  it("POST actor with 422 error by not valid password", (done) => {
    const stubFindOne = sinon.stub(Actor, "findOne").returns(Promise.resolve(undefined));
    chai.request(app)
      .post("/api/v1/actors")
      .send(actorBadPassword)
      .end((_err, res) => {
        expect(stubFindOne.calledOnce).to.be.true;
        expect(res).to.have.status(422);
        expect("Content-Type", /json/);
        done();
      });
  });

  it("GET all actors", (done) => {
    const stub = sinon.stub(Actor, "find").returns(Promise.resolve([{ users: [] }]));
    chai.request(app)
      .get("/api/v1/actors")
      .end((_err, res) => {
        expect(stub.calledOnce).to.be.true;
        expect(res).to.have.status(200);
        expect("Content-Type", /json/);
        done();
      });
  });

  it("GET actor by id", (done) => {
    const stub = sinon.stub(Actor, "findById").returns(Promise.resolve(actorInDB));
    chai.request(app)
      .get("/api/v1/actors/641446af75a2718e86b23500")
      .end((_err, res) => {
        expect(stub.calledOnce).to.be.true;
        expect(res).to.have.status(200);
        expect("Content-Type", /json/);
        done();
      });
  });

  it("GET actor with 404 error", (done) => {
    const stub = sinon.stub(Actor, "findById").returns(Promise.resolve(undefined));
    chai.request(app)
      .get("/api/v1/actors/641446af75a2718e86b235c3")
      .end((_err, res) => {
        expect(stub.calledOnce).to.be.true;
        expect(res).to.have.status(404);
        done();
      });
  });

  it("PUT actor", (done) => {
    const stubFindOne = sinon.stub(Actor, "findOne").returns(Promise.resolve(undefined));
    const stub = sinon.stub(Actor, "findOneAndUpdate").returns(Promise.resolve(new Actor({
      ...actorToUpdate,
      ...actorUpdated
    })));
    chai.request(app)
      .put("/api/v1/actors/641446af75a2718e86b235c3")
      .send({
        ...actorToUpdate,
        ...actorUpdated
      })
      .end((_err, res) => {
        expect(stubFindOne.calledOnce).to.be.true;
        expect(stub.calledOnce).to.be.true;
        expect(res).to.have.status(204);
        expect("Content-Type", /json/);
        done();
      });
  });

  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });
});
