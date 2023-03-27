"use strict";
import {
  listIndicators,
  lastIndicator,
  generateReport,
  rebuildPeriod,
  amountSpentByExplorerController,
  explorersByAmountSpentController
} from "../controllers/DataWareHouseController.js";
import {
  amoutSpentByExplorerValidator,
  explorersByAmountSpentValidator
} from "../controllers/validators/DataWareHouseValidator.js";
import handleExpressValidation from "../middlewares/ValidationHandlingMiddleware.js";
import { periodDecoder } from "../middlewares/PeriodDecoder.js";
import { verifyUser } from "../middlewares/permissions/AuthPermissions.js";

export default function (app) {
  app.route("/api/v1/dashboard")
    .get(listIndicators)
    .post(rebuildPeriod);

  app.route("/api/v1/dashboard/latest")
    .get(
      lastIndicator,
      generateReport);

  app.route("/api/v1/dashboard/amount-spent-by-explorer")
    .post(
      amoutSpentByExplorerValidator,
      handleExpressValidation,
      periodDecoder,
      amountSpentByExplorerController);

  app.route("/api/v1/dashboard/explorers-by-amount-spent")
    .post(
      explorersByAmountSpentValidator,
      handleExpressValidation,
      periodDecoder,
      explorersByAmountSpentController);

  app.route("/api/v2/dashboard")
    .get(verifyUser(["ADMINISTRATOR"]), listIndicators)
    .post(verifyUser(["ADMINISTRATOR"]), rebuildPeriod);

  app.route("/api/v2/dashboard/latest")
    .get(
      verifyUser(["ADMINISTRATOR"]),
      lastIndicator,
      generateReport);

  app.route("/api/v2/dashboard/amount-spent-by-explorer")
    .post(
      verifyUser(["ADMINISTRATOR"]),
      amoutSpentByExplorerValidator,
      handleExpressValidation,
      periodDecoder,
      amountSpentByExplorerController);

  app.route("/api/v2/dashboard/explorers-by-amount-spent")
    .post(
      verifyUser(["ADMINISTRATOR"]),
      explorersByAmountSpentValidator,
      handleExpressValidation,
      periodDecoder,
      explorersByAmountSpentController);
}
