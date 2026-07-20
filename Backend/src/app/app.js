import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter  from "../routes/auth.routes.js";
import cors from "cors";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173" || "http://localhost:5174", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));




app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
    res.status(200).json({ message: "server is running" });
});

app.use("/api/auth", authRouter);




export default app;