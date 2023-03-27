import mongoose from "mongoose";
import Application from "../models/ApplicationModel.js";

export async function findApplicationsByExplorerId(req, res) {
  // explorer_id is the actor_id logged into the system
  const { explorerId } = req.params;
  try {
    const applications = await Application.aggregate([
      { $match: { explorer_id: new mongoose.Types.ObjectId(explorerId) } },
      { $group: { _id: "$status", applications: { $push: "$$ROOT" } } }
    ]);
    res.send(applications);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function findApplicationsByTripId(req, res) {
  const { tripId } = req.params;
  try {
    const applications = await Application.find({ trip_id: tripId });
    res.send(applications);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function addApplication(req, res) {
  // explorer_id is the actor_id logged into the system
  const newApplication = new Application(req.body);
  try {
    const application = await newApplication.save();
    res.status(201).send(application);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function findById(req, res) {
  Application.findById(req.params.id, (err, application) => {
    if (err) {
      res.send(err);
    } else {
      res.send(application);
    }
  });
}

export async function updateApplicationStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const application = await Application.findById(id);
  if (application) {
    application.status = status;
    const updatedApplication = await application.save();
    res.send(updatedApplication);
  } else {
    res.status(404).send({ message: "Application Not Found" });
  }
}

export async function updateApplicationComment(req, res) {
  const { id } = req.params;
  const { comment } = req.body;
  const application = await Application.findById(id);
  if (application && application.status === "PENDING") {
    application.comment = comment;
    const updatedApplication = await application.save();
    res.send(updatedApplication);
  } else {
    if (application.status === "PENDING") {
      res.status(400).send({ message: "Application is not pending" });
    } else {
      res.status(404).send({ message: "Application Not Found" });
    }
  }
}

export async function rejectApplication(req, res) {
  const { id } = req.params;
  const { rejectedReason } = req.body;
  const application = await Application.findById(id);
  if (application && application.status === "PENDING") {
    application.status = "REJECTED";
    application.rejectedReason = rejectedReason;
    const updatedApplication = await application.save();
    res.send(updatedApplication);
  } else {
    if (application.status === "PENDING") {
      res.status(400).send({ message: "Application is not pending" });
    } else {
      res.status(404).send({ message: "Application Not Found" });
    }
  }
}

export async function payApplication(req, res) {
  try {
    const application = await Application.findById(req.params.id);
    if (application) {
      application.status = 'ACCEPTED'
      application.paidAt = new Date();
      application.save()
      res.status(200).send({ message: "Application paid" });
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
