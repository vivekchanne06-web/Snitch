import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter  from "../routes/auth.routes.js";
import cors from "cors";
import { config } from "../config/config.js";
import passport from "passport";
import {Strategy as GoogleStrategy } from "passport-google-oauth20";


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

app.get("/", (_req, res) => {
    res.status(200).json({ message: "server is running" });
});

app.use("/api/auth", authRouter);




export default app;