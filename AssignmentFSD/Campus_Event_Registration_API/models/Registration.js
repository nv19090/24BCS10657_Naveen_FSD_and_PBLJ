const mongoose = require("mongoose");
const registrationSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: [true, "Student name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    collegeEmail: {
        type: String,
        required: [true, "College email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(edu|ac\.in)$/i,
            "Must be a valid college email ending in .edu or .ac.in"
        ]
    },
    rollNumber: {
        type: String,
        required: [true, "Roll number is required"],
        trim: true,
        uppercase: true,
        match: [
            /^[A-Z0-9]{8,10}$/,
            "Roll number must contain 8 to 10 alphanumeric characters"
        ]
    },
    eventType: {
        type: String,
        required: [true, "Event type is required"],
        enum: [
            "CODING_HACKATHON",
            "AI_WORKSHOP",
            "ROBOTICS",
            "GAMING"
        ]
    },
    teamSize: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
        validate: [
            {
                validator: Number.isInteger,
                message: "Team size must be an integer"
            },
            {
                validator: function (value) {
                    return this.eventType !== "AI_WORKSHOP"
                        || value === 1;
                },
                message:
                    "AI Workshop only permits individual registrations"
            }
        ]
    },
    ticketPrice: {
        type: Number,
        required: true,
        min: [0, "Ticket price cannot be negative"]
    },
    discountCode: {
        type: String,
        trim: true,
        uppercase: true,
        enum: ["CAMPUS50", "EARLYBIRD"]
    },
    finalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED"],
        default: "PENDING"
    },
    registrationDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: "Registration date cannot be in the future"
        }
    }
});
registrationSchema.pre("validate", function () {
    if (typeof this.ticketPrice !== "number"
        || !Number.isFinite(this.ticketPrice)) {
        return;
    }
    if (!this.discountCode) {
        this.finalAmount = this.ticketPrice;
    } else if (this.discountCode === "CAMPUS50") {
        this.finalAmount = this.ticketPrice * 0.5;
    } else if (this.discountCode === "EARLYBIRD") {
        this.finalAmount = Math.max(0, this.ticketPrice - 100);
    }
});
module.exports = mongoose.model(
    "Registration",
    registrationSchema
);
