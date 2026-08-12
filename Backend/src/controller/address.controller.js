import addressModel from "../models/address.model.js";

export const createAddress = async (req, res) => {
    try {
        const {
            fullName,
            emailId,
            phoneNumber,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            isDefault
        } = req.body;

        if (!fullName || !phoneNumber || !emailId || !addressLine1 || !city || !state || !postalCode) {
            return res.status(400).json({ success: false, message: "Please fill in all required fields." });
        }

        const addressCount = await addressModel.countDocuments({ user: req.user._id });

        if (addressCount >= 3) {
            return res.status(400).json({ success: false, message: "You can only have a maximum of 3 addresses." });
        }

        const shouldSetDefault = addressCount === 0 ? true : Boolean(isDefault);

        if (shouldSetDefault) {
            await addressModel.updateMany({
                user: req.user._id
            },
                {
                    $set: { isDefault: false }
                },
            );
        }

        const address = await addressModel.create({
            user: req.user._id,
            fullName,
            phoneNumber,
            emailId,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            isDefault: shouldSetDefault,
        });

        return res.status(201).json({ 
            success: true,
            message: "Address created successfully.",
             address 
            });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getAddress = async (req, res) => {
    try {
        const addresses = await addressModel.find({ user: req.user._id });

        return res.status(200).json({
            success: true,
            message: "Addresses retrieved successfully.",
            addresses
        });
        
    }catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}