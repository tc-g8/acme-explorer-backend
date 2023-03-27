import { check } from "express-validator";
import { isFloat } from "./UtilsValidator.js";

const configurationValidator = [
  check("sponsorshipPrice", "The sponsorship flat must be greater than zero")
    .exists({ checkNull: true, checkFalsy: true })
    .isFloat({ min: 0.0 })
    .custom(isFloat),
  check("defaultLanguage", "The languages allowed are Spanish (es) and English (en)")
    .exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape()
    .isIn(["es", "en"]),
  check("cacheLifeTime", "Cache time should be between 1 and 24 hours")
    .exists({ checkNull: true, checkFalsy: true })
    .isNumeric({ no_symbols: true })
    .isInt({ min: 3600, max: 84400 }),
  check("paginationSize", "The maximum size of results per page must be between 10 and 100")
    .exists({ checkNull: true, checkFalsy: true })
    .isNumeric({ no_symbols: true })
    .isInt({ min: 10, max: 100 })
];

export { configurationValidator };
