import { check } from "express-validator";

const filterValidator = [
    check('keyword').optional().isString().trim().escape(),
    check('minPrice').optional().isNumeric({ min: 0.0 }),
    check('maxPrice').optional().isNumeric({ min: 0.0 }),
    check('minDate').optional().isISO8601().toDate(),
    check('maxDate').optional().isISO8601().toDate()
];

export { filterValidator };