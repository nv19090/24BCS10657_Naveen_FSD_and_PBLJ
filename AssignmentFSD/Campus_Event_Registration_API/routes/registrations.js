const express = require("express");
const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const router = express.Router();
const createFields = [
    "studentName",
    "collegeEmail",
    "rollNumber",
    "eventType",
    "teamSize",
    "ticketPrice",
    "discountCode"
];
const updateFields = [
    ...createFields,
    "status",
    "registrationDate"
];
function pickFields(body, allowedFields) {
    const data = {};
    for (const field of allowedFields) {
        if (Object.hasOwn(body, field)) {
            data[field] = body[field];
        }
    }
    return data;
}
function validateId(id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        const error = new Error("Invalid registration ID format");
        error.statusCode = 400;
        throw error;
    }
}
function validateDiscount(code) {
    if (code === undefined || code === null || code === "") {
        return;
    }
    const normalized = String(code).trim().toUpperCase();
    if (!["CAMPUS50", "EARLYBIRD"].includes(normalized)) {
        const error = new Error("Invalid discount code");
        error.statusCode = 400;
        throw error;
    }
}
function getFinalAmount(price, code) {
    if (!code) return price;
    if (code === "CAMPUS50") return price * 0.5;
    if (code === "EARLYBIRD") return Math.max(0, price - 100);
    return price;
}
router.post("/", async (req, res, next) => {
    try {
        const data = pickFields(req.body, createFields);
        if (data.discountCode !== undefined) {
            data.discountCode = String(data.discountCode)
.trim()
                .toUpperCase();
        }
        validateDiscount(data.discountCode);
        const registration = new Registration(data);
        await registration.save();
        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: registration
        });
    } catch (error) {
        next(error);
    }
});
router.get("/", async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.eventType) {
            filter.eventType = req.query.eventType;
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }
        const registrations = await Registration.find(filter);
        res.status(200).json({
            success: true,
            count: registrations.length,
            data: registrations
        });
    } catch (error) {
        next(error);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        validateId(req.params.id);
        const registration = await Registration.findById(
            req.params.id
        );
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }
        res.status(200).json({
            success: true,
            data: registration
        });
    } catch (error) {
        next(error);
    }
});
router.put("/:id", async (req, res, next) => {
    try {
        validateId(req.params.id);
        const existing = await Registration.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }
        const updates = pickFields(req.body, updateFields);
        if (updates.discountCode !== undefined) {
            updates.discountCode = String(updates.discountCode)
                .trim()
                .toUpperCase();
        }
        validateDiscount(updates.discountCode);
        const eventType = updates.eventType ?? existing.eventType;
        const teamSize = updates.teamSize ?? existing.teamSize;
        if (
            eventType === "AI_WORKSHOP" &&
            Number(teamSize) !== 1
        ) {
            return res.status(400).json({
                success: false,
                errors: [
                    "AI Workshop only permits individual registrations"
                ]
            });
        }
        const price = updates.ticketPrice !== undefined
            ? updates.ticketPrice
            : existing.ticketPrice;
        const discount = updates.discountCode !== undefined
            ? updates.discountCode
            : existing.discountCode;
        const finalAmount = getFinalAmount(
            Number(price),
            discount
        );
        const updated = await Registration.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    ...updates,
                    finalAmount
                }
            },
            {
                new: true,
                runValidators: true,
                context: "query"
            }
        );
        res.status(200).json({
            success: true,
            message: "Registration updated successfully",
            data: updated
        });
    } catch (error) {
        next(error);
    }
});
router.delete("/:id", async (req, res, next) => {
    try {
        validateId(req.params.id);
        const registration = await Registration.findByIdAndDelete(
            req.params.id
        );
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Registration deleted successfully",
            data: registration
        });
    } catch (error) {
        next(error);
    }
});
module.exports = router;
