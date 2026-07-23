import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";

export const aunthicateSeller = async (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        if (user.role !== 'seller') {
            return res.status(403).json({ message: "Forbidden: You are not a seller" });
        } 

        req.user = user;
        next(); 
        

    }catch (error) {
        console.error("Error occurred while verifying token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }


}