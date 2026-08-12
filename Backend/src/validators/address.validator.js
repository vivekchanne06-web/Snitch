import { body, validationResult } from 'express-validator'

function validateAddressRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
}

export const userAddressValidator = [

    body("fullName")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters long"),

    body("emailId")
        .isEmail()
        .withMessage("Please provide a valid email address"),

    body("phoneNumber")
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage("Phone number must be between 10 and 15 characters long")
        .isMobilePhone("en-IN")
        .withMessage("Please provide a valid Indian phone number"),

    body("addressLine1")
        .isLength({ min: 5, max: 200 })
        .withMessage("Address line 1 must be between 5 and 200 characters long"),

    body("addressLine2")
        .isLength({ max: 200 })
        .optional({ checkFalsy: true })
        .withMessage("Address line 2 must be at most 200 characters long"),

    body("city")
        .isLength({ min: 2, max: 100 })
        .withMessage("City must be between 2 and 100 characters long"),

    body("state")
        .isLength({ min: 2, max: 100 })
        .withMessage("State must be between 2 and 100 characters long"),

    body("postalCode")
        .isPostalCode("IN")
        .withMessage("Please provide a valid 6-digit Indian postal code"),

    validateAddressRequest

]