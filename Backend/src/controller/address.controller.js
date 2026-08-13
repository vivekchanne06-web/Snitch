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

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
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

        const address = await addressModel.findOne({
            _id: addressId,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found."
            });
        }

        if (Boolean(isDefault === true)) {
            await addressModel.updateMany({
                user: req.user._id,
                _id: { $ne: addressId }
            },
                {
                    $set: { isDefault: false }
                },
            );
        }
        if (fullName !== undefined) {
            address.fullName = fullName;
        }

        if (emailId !== undefined) {
            address.emailId = emailId;
        }

        if (phoneNumber !== undefined) {
            address.phoneNumber = phoneNumber;
        }

        if (addressLine1 !== undefined) {
            address.addressLine1 = addressLine1;
        }

        if (addressLine2 !== undefined) {
            address.addressLine2 = addressLine2;
        }

        if (city !== undefined) {
            address.city = city;
        }

        if (state !== undefined) {
            address.state = state;
        }

        if (postalCode !== undefined) {
            address.postalCode = postalCode;
        }

        if (isDefault !== undefined) {
            address.isDefault = isDefault;
        }
        await address.save();

        return res.status(200).json({
            success: true,
            message: "Address updated successfully.",
            address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const address = await addressModel.findOne({
            _id: addressId,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found."
            });
        }
        const wasDefault = address.isDefault;

           await addressModel.deleteOne({
            _id: addressId,
            user: req.user._id
        });


        if (wasDefault) {
            const nextAddress = await addressModel
                .findOne({
                    user: req.user._id
                })
                .sort({ createdAt: -1 });

            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
