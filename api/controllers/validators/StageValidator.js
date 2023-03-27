import { check } from "express-validator";
import { isFloat } from "./UtilsValidator.js";

const stageValidator = [
    check("title")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Title is required")
        .isString()
        .trim()
        .escape(),
    check("description")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Description is required")
        .isString()
        .trim()
        .escape(),
    check("price")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Price is required")
        .isFloat()
        .custom(isFloat),
]

export { stageValidator }