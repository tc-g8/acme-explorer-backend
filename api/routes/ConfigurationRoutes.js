"use-strict";
import {
  getConfiguration,
  updateConfiguration,
} from "../controllers/ConfigurationController.js";
import { configurationValidator } from "../controllers/validators/ConfigurationValidator.js";
import { verifyUser } from "../middlewares/permissions/AuthPermissions.js";
import handleExpressValidation from "../middlewares/ValidationHandlingMiddleware.js";

export default function (app) {
  app.route("/api/v1/configurations")
    .get(getConfiguration);

  app.route("/api/v1/configurations/:id")
    .put(
      configurationValidator,
      handleExpressValidation,
      updateConfiguration
    );

  app.route("/api/v2/configurations")
    .get(
      verifyUser(["ADMINISTRATOR"]),
      getConfiguration);

  app.route("/api/v2/configurations/:id")
    .put(
      verifyUser(["ADMINISTRATOR"]),
      configurationValidator,
      handleExpressValidation,
      updateConfiguration
    );
}
