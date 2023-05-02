import { check } from "express-validator";

const creationValidator = [
  check("comment").optional()
    .isString()
    .trim(),
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
];

const rejectValidator = [
  check("rejectedReason").exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
];

export { creationValidator, statusValidator, commentValidator, rejectValidator };
