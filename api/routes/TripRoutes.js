"use-strict";
import {
  findTrips,
  findById,
  updateTrip,
  deleteTrip,
  addTrip,
  findTripsByManagerId,
  publishTrip,
  cancelTrip,
  addStage,
  updateTripStage,
  findSponsorshipsBySponsorId,
  getTripSponsorshipById,
  addSponsorship,
  updateTripSponsorship,
  deleteTripSponsorshipLogically,
  paySponsorship
} from "../controllers/TripController.js";
import { filterValidator } from "../controllers/validators/FinderValidator.js";
import handleExpressValidation from "../middlewares/ValidationHandlingMiddleware.js";
import { addFinder } from "../controllers/FinderController.js";
import { creationValidator, updateValidator, cancelValidator } from "../controllers/validators/TripValidator.js";
import { stageValidator } from "../controllers/validators/StageValidator.js";
import { creationSponsorshipValidator, updateSponsorshipValidator } from "../controllers/validators/SponsorshipValidator.js";
import { getLastFinder } from "../middlewares/FinderMiddleware.js";
import { checkTripPublished, checkCancelableTrip } from "../middlewares/BusinessRulesTrip.js";
import { verifyUser } from "../middlewares/permissions/AuthPermissions.js";

export default function (app) {
  app.route("/api/v1/trips")
    .get(
      filterValidator,
      handleExpressValidation,
      getLastFinder,
      addFinder,
      findTrips
    )
    .post(
      creationValidator,
      handleExpressValidation,
      addTrip);

  app.route("/api/v1/trips/:id")
    .get(findById)
    .put(
      updateValidator,
      handleExpressValidation,
      checkTripPublished,
      updateTrip
    )
    .delete(
      checkTripPublished,
      deleteTrip);

  app.route("/api/v1/trips/manager/:managerId")
    .get(findTripsByManagerId);

  app.route("/api/v1/trips/:id/publish")
    .patch(publishTrip);

  app.route("/api/v1/trips/:id/cancel")
    .patch(
      cancelValidator,
      handleExpressValidation,
      checkCancelableTrip,
      cancelTrip
    );

  app.route("/api/v1/trips/:id/stages")
    .put(
      stageValidator,
      handleExpressValidation,
      addStage
    );

  app.route("/api/v1/trips/:tripId/stages/:stageId")
    .put(
      stageValidator,
      handleExpressValidation,
      updateTripStage
    );

  app.route("/api/v1/trips/:id/sponsorships")
    .put(
      creationSponsorshipValidator,
      handleExpressValidation,
      addSponsorship
    );

  app.route("/api/v1/trips/:tripId/sponsorships/:sponsorshipId")
    .put(
      updateSponsorshipValidator,
      handleExpressValidation,
      updateTripSponsorship
    );

  app.route("/api/v1/trips/:tripId/sponsorships/:sponsorshipId")
    .patch(deleteTripSponsorshipLogically);

  app.route("/api/v1/trips/sponsorships/:id")
    .get(getTripSponsorshipById);

  app.route("/api/v1/trips/sponsorships/sponsor/:id")
    .get(findSponsorshipsBySponsorId);

  app.route("/api/v1/trips/:tripId/sponsorships/:sponsorshipId/pay")
    .post(paySponsorship);

  app.route("/api/v2/trips")
    .post(
      verifyUser(["MANAGER"]),
      creationValidator,
      handleExpressValidation,
      addTrip
    );

  app.route("/api/v2/trips/:id")
    .put(
      verifyUser(["MANAGER"]),
      updateValidator,
      handleExpressValidation,
      checkTripPublished,
      updateTrip
    )
    .delete(
      verifyUser(["MANAGER"]),
      checkTripPublished,
      deleteTrip);

  app.route("/api/v2/trips/manager/:managerId")
    .get(
      verifyUser(["MANAGER"]),
      findTripsByManagerId
    );

  app.route("/api/v2/trips/:id/publish")
    .patch(
      verifyUser(["MANAGER"]),
      publishTrip
    );

  app.route("/api/v2/trips/:id/cancel")
    .patch(
      verifyUser(["MANAGER"]),
      cancelValidator,
      handleExpressValidation,
      checkCancelableTrip,
      cancelTrip
    );

  app.route("/api/v2/trips/:id/stages")
    .put(
      verifyUser(["MANAGER"]),
      stageValidator,
      handleExpressValidation,
      addStage
    );

  app.route("/api/v2/trips/:tripId/stages/:stageId")
    .put(
      verifyUser(["MANAGER"]),
      stageValidator,
      handleExpressValidation,
      updateTripStage
    );

  app.route("/api/v2/trips/:id/sponsorships")
    .put(
      verifyUser(["SPONSOR"]),
      creationSponsorshipValidator,
      handleExpressValidation,
      addSponsorship
    );

  app.route("/api/v2/trips/:tripId/sponsorships/:sponsorshipId")
    .put(
      verifyUser(["SPONSOR"]),
      updateSponsorshipValidator,
      handleExpressValidation,
      updateTripSponsorship
    );

    app.route("/api/v2/trips/:tripId/sponsorships/:sponsorshipId")
    .patch(
      verifyUser(["SPONSOR"]),
      deleteTripSponsorshipLogically
    );

  app.route("/api/v2/trips/:tripId/sponsorships/:sponsorshipId/pay")
    .post(
      verifyUser(["SPONSOR"]),
      paySponsorship
    );
}
