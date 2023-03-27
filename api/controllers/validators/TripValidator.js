import { check } from "express-validator";
import { startDateBeforeEndDate, endDateBeforeStartDate, isFloat } from "./UtilsValidator.js";

const creationValidator = [
  check("ticker", "Ticker can not be defined")
    .not()
    .exists(),
  check("title")
    .exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape(),
  check("description")
    .exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape(),
  check("price", "Price can not be defined")
    .not()
    .exists(),
  check("requirements")
    .exists({ checkNull: true, checkFalsy: true })
    .isArray(),
  check("endDate")
    .exists({ checkNull: true, checkFalsy: true })
    .isDate()
    .isAfter(new Date().toDateString()),
  check("startDate")
    .exists({ checkNull: true, checkFalsy: true })
    .isDate()
    .isAfter(new Date().toDateString())
    .custom(startDateBeforeEndDate),
  check("imageCollection")
    .optional()
    .isArray(),
  check("cancelationReason", "Cancelation reason can not be defined")
    .not()
    .exists(),
  check("stages")
    .exists({ checkNull: true, checkFalsy: true })
    .isArray(),
  check("stages.*.title")
    .exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape(),
  check("stages.*.description")
    .exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape(),
  check("stages.*.price")
    .exists({ checkNull: true, checkFalsy: true })
    .isFloat()
    .custom(isFloat),
  check("sponsorships", "Sponsorships can not be defined")
    .not()
    .exists(),
  check("status", "Status can not be defined")
    .not()
    .exists(),
  check("manager_id")
    .exists({ checkNull: true, checkFalsy: true })
    .isMongoId(),
];

const updateValidator = [
  check("ticker", "Ticker can not be defined")
    .not()
    .exists(),
  check("title")
    .optional()
    .isString()
    .notEmpty()
    .trim()
    .escape(),
  check("description")
    .optional()
    .isString()
    .notEmpty()
    .trim()
    .escape(),
  check("price", "Price can not be defined")
    .not()
    .exists(),
  check("requirements")
    .optional()
    .notEmpty()
    .isArray(),
  check("endDate")
    .optional()
    .isDate()
    .isAfter(new Date().toDateString())
    .custom(endDateBeforeStartDate),
  check("startDate")
    .optional()
    .isDate()
    .isAfter(new Date().toDateString())
    .custom(startDateBeforeEndDate),
  check("imageCollection")
    .optional()
    .isArray(),
  check("cancelationReason", "Cancelation reason can not be defined")
    .not()
    .exists(),
  check("stages")
    .not()
    .exists(),
  check("sponsorships", "Sponsorships can not be defined")
    .not()
    .exists(),
  check("status", "Status can not be defined")
    .not()
    .exists(),
  check("manager_id")
    .not()
    .exists()
];

const cancelValidator = [
  check("cancelationReason")
    .exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape(),
];

export { creationValidator, updateValidator, cancelValidator }
