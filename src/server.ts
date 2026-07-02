// ⚠️ dotenv.config() must be the very first thing (before any imports that use env vars)
import dotenv from "dotenv";
dotenv.config();   // <-- now loaded before anything else

import { connectDB } from "./config/db";
import http from "http";
import app from "./app";   // this import may access process.env – now env is loaded

async function startServer() {
    await connectDB();
    const server = http.createServer(app);
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    });
}

startServer().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
});