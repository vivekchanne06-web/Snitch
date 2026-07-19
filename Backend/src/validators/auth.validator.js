import {body, validationResult } from 'express-validator';


function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


export const registerValidatorUser = [
    body("email")
    .isEmail().withMessage("Please provide a valid email"),

    body("contact")
    .matches(/^\d{10}$/).withMessage("Contact number must be 10 digits long"),

    body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    body("fullName")
    .isLength({ min: 2, max: 100 }).withMessage("Full name must be between 2 and 100 characters long"),


    validateRequest()
]