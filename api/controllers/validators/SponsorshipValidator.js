import { check } from "express-validator";

const creationSponsorshipValidator = [
  check("banner")
    .exists({ checkNull: true, checkFalsy: true }),
  check("landingPage")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Landing page is required")
    .isString()
    .isURL()
    .withMessage("Landing page must be an URL")
    .trim(),
  check("amount")
    .not()
    .exists(),
  check("status")
    .not()
    .exists(),
  check("sponsor_id")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Sponsor id required")
];

const updateSponsorshipValidator = [
  check("landingPage")
    .optional()
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Landing page can not be empty")
    .isString()
    .isURL()
    .withMessage("Landing page must be an URL")
    .trim(),
  check("amount")
    .not()
    .exists(),
  check("status")
    .not()
    .exists(),
  check("sponsor_id")
    .not()
    .exists()
];

export { creationSponsorshipValidator, updateSponsorshipValidator };
