/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../../app.js";
import Trip from "../../api/models/TripModel.js";

const { expect } = chai;
chai.use(chaiHttp);

const publishedTrip = new Trip({
    "ticker": "230901-WENO",
    "title": "duis non quis officia sunt non consequat sit",
    "description": "Ea labore laborum enim tempor exercitation laboris proident sit aliqua. Nostrud aliquip tempor voluptate irure. Id dolore enim adipisicing elit esse id consectetur quis id.",
    "price": 32,
    "requirements": [
        "Dolor in reprehenderit est consequat ad amet voluptate deserunt esse sunt duis.",
        "Sunt consectetur esse ut cillum adipisicing elit ut Lorem consectetur cupidatat.",
    ],
    "startDate": "2023-04-06T00:01:15.533Z",
    "endDate": "2023-04-09T00:01:15.533Z",
    "imageCollection": [],
    "cancelationReason": null,
    "stages": [
        {
            "title": "et Lorem tempor ea fugiat",
            "description": "Lorem adipisicing aliquip occaecat ullamco proident pariatur Lorem anim laborum. Aliquip deserunt incididunt laborum proident duis aute.",
            "price": 14,
            "_id": "63f87742a1f919602d611ec2"
        },
        {
            "title": "minim dolore nisi deserunt labore",
            "description": "Dolor quis laborum aliqua dolore voluptate. Quis nisi dolor consectetur fugiat reprehenderit.",
            "price": 18,
            "_id": "63f877421c001d0f390538bd"
        }
    ],
    "sponsorships": [
        {
            "banner": "",
            "landingPage": "http://randomdomain.com/",
            "amount": 300,
            "status": "PENDING",
            "sponsor_id": "63f87774794e14894cfade2e",
            "_id": "63f877428fcf44d5f82f88e2"
        },
        {
            "banner": "",
            "landingPage": "http://randomdomain.com/",
            "amount": 300,
            "status": "ACCEPTED",
            "sponsor_id": "63f877743ca16d8339380484",
            "_id": "63f877424363b454c3c58d9b"
        }
    ],
    "manager_id": "63f877747afcfe31acd9844a",
    "status": "PUBLISHED",
    "_id": "63f877427410ca0a32c8b904",
    "__v": 0
})

const draftTrip = new Trip({
    "ticker": "230901-WENO",
    "title": "duis non quis officia sunt non consequat sit",
    "description": "Ea labore laborum enim tempor exercitation laboris proident sit aliqua. Nostrud aliquip tempor voluptate irure. Id dolore enim adipisicing elit esse id consectetur quis id.",
    "price": 32,
    "requirements": [
        "Dolor in reprehenderit est consequat ad amet voluptate deserunt esse sunt duis.",
        "Sunt consectetur esse ut cillum adipisicing elit ut Lorem consectetur cupidatat.",
    ],
    "startDate": "2023-04-06T00:01:15.533Z",
    "endDate": "2023-04-09T00:01:15.533Z",
    "imageCollection": [],
    "cancelationReason": null,
    "stages": [
        {
            "title": "et Lorem tempor ea fugiat",
            "description": "Lorem adipisicing aliquip occaecat ullamco proident pariatur Lorem anim laborum. Aliquip deserunt incididunt laborum proident duis aute.",
            "price": 14,
            "_id": "63f87742a1f919602d611ec2"
        },
        {
            "title": "minim dolore nisi deserunt labore",
            "description": "Dolor quis laborum aliqua dolore voluptate. Quis nisi dolor consectetur fugiat reprehenderit.",
            "price": 18,
            "_id": "63f877421c001d0f390538bd"
        }
    ],
    "sponsorships": [
        {
            "banner": "",
            "landingPage": "http://randomdomain.com/",
            "amount": 300,
            "status": "PENDING",
            "sponsor_id": "63f87774794e14894cfade2e",
            "_id": "63f877428fcf44d5f82f88e2"
        },
        {
            "banner": "",
            "landingPage": "http://randomdomain.com/",
            "amount": 300,
            "status": "ACCEPTED",
            "sponsor_id": "63f877743ca16d8339380484",
            "_id": "63f877424363b454c3c58d9b"
        }
    ],
    "manager_id": "63f877747afcfe31acd9844a",
    "status": "DRAFT",
    "_id": "63f877427410ca0a32c8b904",
    "__v": 0
})
const today = new Date();

describe("Trip Controller test", () => {
    let endDate = new Date();
    endDate.setDate(today.getDate() + 5);
    let startDate = new Date();
    startDate.setDate(today.getDate() + 1);

    it("POST /trip", (done) => {
        const trip = {
            title: 'Title',
            description: 'Description',
            requirements: ['Requirement 1'],
            endDate: "2025-05-29",
            startDate: "2025-05-25",
            stages: [{
                title: 'Stage',
                description: 'Stage description',
                price: 25.5
            }],
            manager_id: '641592b23258f3673e38137a'
        }
        const stub = sinon.stub(Trip.prototype, "save").returns(Promise.resolve([{ trip }]));
        chai.request(app)
            .post("/api/v1/trips")
            .send(trip)
            .end((_err, res) => {
                expect(stub.calledOnce).to.be.true;
                expect(res).to.have.status(200);
                expect("Content-Type", /json/);
                done();
            });
    });

    it("POST trip with 500 error", (done) => {
        const trip = {
            title: 'Title',
            description: 'Description',
            requirements: ['Requirement 1'],
            endDate: "2025-05-29",
            startDate: "2025-05-25",
            stages: [{
                title: 'Stage',
                description: 'Stage description',
                price: 25.5
            }],
            manager_id: '641592b23258f3673e38137a'
        }
        const stub = sinon.stub(Trip.prototype, "save").throws();
        chai.request(app)
            .post("/api/v1/trips")
            .send(trip)
            .end((_err, res) => {
                expect(stub.calledOnce).to.be.true;
                expect(res).to.have.status(500);
                expect("Content-Type", /json/);
                done();
            });
    });

    it("PUT trip", (done) => {
        const trip = {
            title: "string"
        }
        const stub = sinon.stub(Trip, "findOneAndUpdate").returns(Promise.resolve([{ publishedTrip }]));
        const stubPublished = sinon.stub(Trip, "findById").returns(Promise.resolve([{ publishedTrip }]));
        chai.request(app)
            .put("/api/v1/trips/" + publishedTrip._id.toString())
            .send(trip)
            .end((_err, res) => {
                expect(stub.calledOnce).to.be.true;
                expect(stubPublished.calledOnce).to.be.true;
                expect(res).to.have.status(200);
                expect("Content-Type", /json/);
                done();
            });
    });

    it("PUT trip with 404 error", (done) => {
        const trip = {
            title: "string"
        }
        const stub = sinon.stub(Trip, "findOneAndUpdate").returns(Promise.resolve(undefined));
        const stubPublished = sinon.stub(Trip, "findById").returns(Promise.resolve(undefined));
        chai.request(app)
            .put("/api/v1/trips/" + publishedTrip._id.toString())
            .send(trip)
            .end((_err, res) => {
                expect(stub.notCalled).to.be.true;
                expect(stubPublished.calledOnce).to.be.true;
                expect(res).to.have.status(404);
                expect("Content-Type", /json/);
                done();
            });
    });

    it("PUT trip with 500 error", (done) => {
        const trip = {
            title: "string"
        }
        const stub = sinon.stub(Trip, "findOneAndUpdate").throws();
        const stubPublished = sinon.stub(Trip, "findById").returns(Promise.resolve(draftTrip));
        chai.request(app)
            .put("/api/v1/trips/" + publishedTrip._id.toString())
            .send(trip)
            .end((_err, res) => {
                expect(stub.calledOnce).to.be.true;
                expect(stubPublished.calledOnce).to.be.true;
                expect(res).to.have.status(500);
                expect("Content-Type", /json/);
                done();
            });
    });

    it("GET all trips by manager ID", (done) => {
        const stub = sinon.stub(Trip, "find").returns(Promise.resolve([{ trips: [publishedTrip, draftTrip] }]));
        chai.request(app)
            .get("/api/v1/trips/manager/" + publishedTrip.manager_id.toString())
            .end((_err, res) => {
                expect(stub.calledOnce).to.be.true;
                expect(res).to.have.status(200);
                expect("Content-Type", /json/);
                done();
            });
    });

    it("GET all trips by manager ID with 500 error", (done) => {
        const stub = sinon.stub(Trip, "find").throws();
        chai.request(app)
            .get("/api/v1/trips/manager/" + publishedTrip.manager_id.toString())
            .end((_err, res) => {
                expect(stub.calledOnce).to.be.true;
                expect(res).to.have.status(500);
                expect("Content-Type", /json/);
                done();
            });
    });

    it("PUT create a stage trip", (done) => {
        const stage = {
            title: "title",
            description: "description",
            price: 25.5
        }
        const stub = sinon.stub(Trip, "findById").returns(Promise.resolve(draftTrip));
        const stubSave = sinon.stub(Trip.prototype, "save").returns(Promise.resolve(draftTrip));
        chai.request(app)
            .put("/api/v1/trips/" + draftTrip._id.toString() + "/stages")
            .send(stage)
            .end((_err, res) => {
                expect(stub.calledOnce).to.be.true;
                expect(stubSave.calledOnce).to.be.true;
                expect(res).to.have.status(200);
                expect("Content-Type", /json/);
                done();
            });
    });

    it("PUT update a sponsorship trip", (done) => {
        const sponsorship = {
            landingPage: "www.google.com"
        }
        const stub = sinon.stub(Trip, "findById").returns(Promise.resolve(draftTrip));
        const stubSave = sinon.stub(Trip.prototype, "save").returns(Promise.resolve(draftTrip));
        chai.request(app)
            .put("/api/v1/trips/" + draftTrip._id.toString() + "/sponsorships/" + draftTrip.sponsorships[0]._id.toString())
            .send(sponsorship)
            .end((_err, res) => {
                expect(stub.calledOnce).to.be.true;
                expect(stubSave.calledOnce).to.be.true;
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
