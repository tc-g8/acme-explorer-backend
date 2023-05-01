import { check } from "express-validator";

const creationValidator = [
  check("comment").optional()
    .isString()
    .trim()
    .escape(),
  check("trip_id").exists({ checkNull: true, checkFalsy: true })
];

const statusValidator = [
  check("status").exists({ checkNull: true, checkFalsy: true })
    .isString()
    .isIn(["DUE", "CANCELLED"])
];

const commentValidator = [
  check("comment").exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape()
];

const rejectValidator = [
  check("rejectedReason").exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape()
];

export { creationValidator, statusValidator, commentValidator, rejectValidator };
