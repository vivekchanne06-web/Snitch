import redis from "ioredis";
import { config } from "./config.js";



const Redis = new redis({
  
     host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD
})


Redis.on("connect", () => {
    console.log("Connected to Redis");
});

Redis.on("ready", () => {
    console.log("Redis is ready to use");
});

Redis.on("error", (err) => {
    console.error("Redis error:", err);
});

export default Redis;