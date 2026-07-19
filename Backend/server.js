import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();
import app from "./src/app/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3000;


const startServer = async () => {
    try {
        await connectDB();
    
     app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    }catch (error) {
        console.error("Error starting the server:", error.message);
        process.exit(1);
    }

}
startServer();


