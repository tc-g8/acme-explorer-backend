import mongoose from "mongoose";
import Actor from "../../models/ActorModel.js";
import { getUserIdToken } from "./AuthPermissions.js";


export const checkAddActorPermissions = async (req, res, next) => {
  const idToken = req.headers.idtoken;
  if (idToken) {
    const authenticatedUserId = await getUserIdToken(idToken);
    if (authenticatedUserId) {
      try {
        const actor = await Actor.findOne({ _id: authenticatedUserId });
        if (actor.role[0] === "ADMINISTRATOR") {
          next();
        } else {
          res.status(403).send("You do not have permissions to create an actor.");
        }
      } catch (err) {
        res.status(500).send({
          message: "Unexpected error",
          err
        });
      }
    } else {
      res.status(401).send({
        message: "Your session has expired."
      });
    }
  } else {
    req.body.role = ["EXPLORER"];
    next();
  }
};

export const checkActorPermissions = async (req, res, next) => {
  const idToken = req.headers.idtoken;
  const authenticatedUserId = await getUserIdToken(idToken);
  if (authenticatedUserId) {
    try {
      const actor = await Actor.findOne({ _id: authenticatedUserId });
      const role = actor.role
      if (role.includes("ADMINISTRATOR")) {
        next();
      } else if (role.includes("MANAGER") || role.includes("EXPLORER") || role.includes("SPONSOR")) {
        if (authenticatedUserId.equals(new mongoose.Types.ObjectId(req.params.id))) {
          next();
        } else {
          res.status(403).send("You are attempting to perform an action on an Actor that is not yourself!");
        }
      }
    } catch (err) {
      res.status(500).send({
        message: "Unexpected error",
        err
      });
    }
  } else {
    res.status(401).send({
      message: "Your session has expired."
    });
  }
}