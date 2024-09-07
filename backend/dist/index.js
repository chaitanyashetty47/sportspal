"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_API_KEY);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Middleware to check authentication
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'No token provided' });
    const { data: { user }, error } = yield supabase.auth.getUser(token);
    if (error || !user)
        return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
});
// Create a booking
app.post('/bookings', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { turfId, startTime, endTime } = req.body;
    try {
        const booking = yield prisma.booking.create({
            data: {
                userId: req.user.id,
                turfId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                totalCost: 0, // Calculate this based on your business logic
                status: 'PENDING',
            },
        });
        res.json(booking);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to create booking' });
    }
}));
// Update a booking
app.put('/bookings/:id', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { startTime, endTime, status } = req.body;
    try {
        const booking = yield prisma.booking.update({
            where: { id },
            data: {
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                status,
            },
        });
        res.json(booking);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update booking' });
    }
}));
// Delete a booking
app.delete('/bookings/:id', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.booking.delete({ where: { id } });
        res.json({ message: 'Booking deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to delete booking' });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
