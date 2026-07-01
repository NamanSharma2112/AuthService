import dotenv from "dotenv";
import { connectDB } from "./config/db";
import http from "http";
import app from "./app";
dotenv.config();


async function startServer() {

    await connectDB();
    const server = http.createServer(app);
    server.listen(process.env.PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
    });               
}


startServer().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
} )