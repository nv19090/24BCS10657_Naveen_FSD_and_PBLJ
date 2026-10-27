const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const registrationRoutes = require("./routes/registrations");
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Campus Event Registration API is running"
    });
});
app.use("/api/registrations", registrationRoutes);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});
app.use((err, req, res, next) => {
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "This email is already registered for the event"
        });
    }
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(
            item => item.message
        );
        return res.status(400).json({
            success: false,
            errors
        });
    }
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid registration ID format"
        });
    }
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body"
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from .env");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
}
startServer();
