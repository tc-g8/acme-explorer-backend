"use-strict";
import {
  findApplicationsByExplorerId,
  findApplicationsByTripId,
  findById,
  addApplication,
  updateApplicationStatus,
  updateApplicationComment,
  rejectApplication,
  payApplication
} from "../controllers/ApplicationController.js";
import { creationValidator, statusValidator, commentValidator, rejectValidator } from "../controllers/validators/ApplicationValidator.js";
import { checkApplicationExists, checkInvalidTrip } from "../middlewares/BusinessRulesApplication.js";
import handleExpressValidation from "../middlewares/ValidationHandlingMiddleware.js";
import { verifyUser } from "../middlewares/permissions/AuthPermissions.js";
import { checkUpdateStatusPermissions } from "../middlewares/permissions/ApplicationPermissions.js"

export default function (app) {
  app.route("/api/v1/applications")
    .post(
      creationValidator,
      handleExpressValidation,
      checkApplicationExists,
      checkInvalidTrip,
      addApplication
    );

  app.route("/api/v1/applications/:id")
    .get(findById);

  app.route("/api/v1/applications/:id/change-status")
    .patch(
      statusValidator,
      handleExpressValidation,
      updateApplicationStatus
    );

  app.route("/api/v1/applications/:id/change-comment")
    .patch(
      commentValidator,
      handleExpressValidation,
      updateApplicationComment
    );

  app.route("/api/v1/applications/:id/reject")
    .patch(
      rejectValidator,
      handleExpressValidation,
      rejectApplication
    );

  app.route("/api/v1/applications/:id/pay")
    .post(payApplication);

  app.route("/api/v1/applications/explorer/:explorerId")
    .get(findApplicationsByExplorerId);

  app.route("/api/v1/applications/trip/:tripId")
    .get(findApplicationsByTripId);

  app.route("/api/v2/applications")
    .post(
      verifyUser(["EXPLORER"]),
      creationValidator,
      handleExpressValidation,
      checkApplicationExists,
      checkInvalidTrip,
      addApplication
    );

  app.route("/api/v2/applications/:id")
    .get(
      verifyUser(["MANAGER", "EXPLORER"]),
      findById
    );

  app.route("/api/v2/applications/:id/change-status")
    .patch(
      verifyUser(["MANAGER", "EXPLORER"]),
      statusValidator,
      handleExpressValidation,
      checkUpdateStatusPermissions,
      updateApplicationStatus
    );

  app.route("/api/v2/applications/:id/change-comment")
    .patch(
      verifyUser(["EXPLORER"]),
      commentValidator,
      handleExpressValidation,
      updateApplicationComment
    );

  app.route("/api/v2/applications/:id/reject")
    .patch(
      verifyUser(["MANAGER"]),
      rejectValidator,
      handleExpressValidation,
      rejectApplication
    );

  app.route("/api/v2/applications/:id/pay")
    .post(
      verifyUser(["EXPLORER"]),
      payApplication
    );

  app.route("/api/v2/applications/explorer/:explorerId")
    .get(
      verifyUser(["EXPLORER"]),
      findApplicationsByExplorerId
    );

  app.route("/api/v2/applications/trip/:tripId")
    .get(
      verifyUser(["MANAGER"]),
      findApplicationsByTripId
    );
}
