/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../../app.js";
import Application from "../../api/models/ApplicationModel.js";

const { expect } = chai;
chai.use(chaiHttp);

const application = new Application({
  requestDate: Date.now(),
  status: "PENDING",
  comment: "I want to travel",
  trip_id: "641446af00a2718e86b23500",
  explorer_id: "641446af75a2718e86b235fb"
});

describe("Application Controller test", () => {
  it("PATCH change status of application", (done) => {
    const stubFind = sinon.stub(Application, "findById").returns(Promise.resolve(application));
    const applicationUpdated = new Application(application);
    applicationUpdated.status = "DUE";
    const stubSave = sinon.stub(Application.prototype, "save").returns(Promise.resolve(applicationUpdated));
    chai.request(app)
      .patch("/api/v1/applications/641446af75a2718e86b23500/change-status")
      .send({
        status: "DUE"
      })
      .end((_err, res) => {
        expect(stubFind.calledOnce).to.be.true;
        expect(stubSave.calledOnce).to.be.true;
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal("DUE");
        done();
      });
  });

  it("PATCH change status of application with 422 error", (done) => {
    chai.request(app)
      .patch("/api/v1/applications/641446af75a2718e86b23500/change-status")
      .send({
        status: "REJECTED"
      })
      .end((_err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });

  it("PATCH reject application", (done) => {
    application.status = "PENDING";
    const stubFind = sinon.stub(Application, "findById").returns(Promise.resolve(application));
    const applicationUpdated = new Application(application);
    applicationUpdated.status = "REJECTED";
    applicationUpdated.rejectedReason = "reason here...";
    const stubSave = sinon.stub(Application.prototype, "save").returns(Promise.resolve(applicationUpdated));
    chai.request(app)
      .patch("/api/v1/applications/641446af75a2718e86b23500/reject")
      .send({
        rejectedReason: "reason here...",
      })
      .end((_err, res) => {
        expect(stubFind.calledOnce).to.be.true;
        expect(stubSave.calledOnce).to.be.true;
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal("REJECTED");
        expect(res.body.rejectedReason).to.equal("reason here...");
        done();
      });
  });

  it("GET all applications by trip id", (done) => {
    const stub = sinon.stub(Application, "find").returns(Promise.resolve([{ applications: [] }]));
    chai.request(app)
      .get("/api/v1/applications/trip/641446af75a2718e86b235cc")
      .end((_err, res) => {
        expect(stub.calledOnce).to.be.true;
        expect(res).to.have.status(200);
        expect("Content-Type", /json/);
        done();
      });
  });

  it("POST pay an application", (done) => {
    const stub = sinon.stub(Application, "findById").returns(Promise.resolve(application));
    chai.request(app)
      .post("/api/v1/applications/641446af75a2718e86b235cc/pay")
      .end((_err, res) => {
        expect(stub.calledOnce).to.be.true;
        expect(res).to.have.status(200);
        expect("Content-Type", /json/);
        done();
      });
  });

  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });
});
