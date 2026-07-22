import UserModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: '7d'
        });

    res.cookie('token', token,)

    res.status(200).json({
        success: true,
        message: message,
        token,
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            contact: user.contact,
            role: user.role
        }
    });
}


export const registerUser = async (req, res) => {
    const { email, contact, password, fullName, isSeller } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { contact }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or contact number already exists" });
        }

        // Create a new user
        const User = await UserModel.create({
            email,
            contact,
            password,
            fullName,
            role: isSeller ? 'seller' : 'buyer'
        });


        await sendTokenResponse(User, res, "User registered successfully");


    } catch (error) {
        console.error("Error occurred while checking user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const loginUser = async (req, res) => {

    try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    
    await sendTokenResponse(user, res, "User logged in successfully");
}catch (error) {
    console.error("Error occurred while logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
}

}

export const googleCallback = async (req, res) => {
    
    console.log("Google callback called");

    res.redirect(`http://localhost:5173`)
}