import {body, validationResult } from 'express-validator';

function validateProduct(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error ", errors: errors.array() });
    }
    next();
}

export const addProductValidator = [
    body("title")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters long"),

    body("description")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters long"),

    body("priceAmount")
    .isFloat({ gt: 0 })
    .withMessage("Price amount must be a positive number")
    .isNumeric()
    .withMessage("Price amount must be a number"),

    body("priceCurrency")
    .isIn(["USD", "INR"])
    .withMessage("Price currency must be either 'USD' or 'INR'"),


    validateProduct
]