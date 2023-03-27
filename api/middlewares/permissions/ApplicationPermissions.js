import Application from "../../models/ApplicationModel.js";
import Actor from "../../models/ActorModel.js"
import { getUserIdToken } from "./AuthPermissions.js";


export const checkUpdateStatusPermissions = async (req, res, next) => {
  // explorer can cancel application if it is pending, due or accepted
  // manager can change the status application if it is pending to due or rejected (have their own endpoint)
  const idToken = req.headers.idtoken;
  const authenticatedUserId = await getUserIdToken(idToken);
  if (authenticatedUserId) {
    try {
      const actor = await Actor.findOne({ _id: authenticatedUserId });
      const role = actor.role;
      const application = await Application.findById(req.params.id);
      if (role.includes("MANAGER") && application.status === "PENDING") {
        req.body.status = "DUE";
        next();
      } else if (role.includes("EXPLORER") &&
        (application.status === "PENDING"
          || application.status === "DUE"
          || application.status === "ACCEPTED")) {
        req.body.status = "CANCELLED";
        next();
      } else {
        res.status(401).send("You cannot change the status of the application.");
      }
    } catch (err) {
      res.status(500).send({
        message: "Unexpected error",
        err
      });
    }
  } else {
    res.status(401).send("Your session has expired!");
  }
};