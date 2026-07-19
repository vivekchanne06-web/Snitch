import UserModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

async function sendTokenResponse(user, res) {
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET)

}


export const registerUser = async (req, res) => {
    const { email, contact, password, fullName } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { contact }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or contact number already exists" });
        }

        // Create a new user
        const User = await UserModel.create({ email, contact, password, fullName });




    } catch (error) {
        console.error("Error occurred while checking user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}