import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter  from "../routes/auth.routes.js";
import cors from "cors";
import { config } from "../config/config.js";
import passport from "passport";
import {Strategy as GoogleStrategy } from "passport-google-oauth20";
import productRouter from "../routes/product.route.js";
import cartRouter from "../routes/cart.route.js";
import addressRouter from "../routes/address.route.js";
import orderRouter from "../routes/order.routes.js";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173" || "http://localhost:5174", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));


app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback", 
  },(accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }))


app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
    res.status(200).json({ message: "server is running" }); 
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/orders", orderRouter);




export default app;