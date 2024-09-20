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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingsByUser = exports.createBookings = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingData = req.body;
        console.log('Received booking data:', bookingData);
        if (!bookingData.bookings || bookingData.bookings.length === 0) {
            return res.status(400).json({ error: 'No booking data provided' });
        }
        const booking = bookingData.bookings[0];
        console.log('Processing booking:', booking);
        if (!booking.userEmail) {
            console.log('User email is missing. Booking object:', booking);
            return res.status(400).json({ error: 'User email is required' });
        }
        // Find the user by email
        const user = yield prisma.user.findUnique({
            where: { email: booking.userEmail }
        });
        if (!user) {
            console.log('User not found for email:', booking.userEmail);
            return res.status(400).json({ error: 'User not found' });
        }
        // Check for overlapping bookings
        const overlappingBooking = yield prisma.booking.findFirst({
            where: {
                turfId: booking.turfId,
                AND: [
                    {
                        startTime: {
                            lt: new Date(booking.endTime)
                        }
                    },
                    {
                        endTime: {
                            gt: new Date(booking.startTime)
                        }
                    }
                ]
            }
        });
        if (overlappingBooking) {
            console.log('Overlapping booking found:', overlappingBooking);
            return res.status(400).json({ error: 'This time slot is already booked' });
        }
        const createdBooking = yield prisma.booking.create({
            data: {
                startTime: new Date(booking.startTime),
                endTime: new Date(booking.endTime),
                totalCost: booking.totalCost,
                turfId: booking.turfId,
                userEmail: booking.userEmail,
                status: 'CONFIRMED',
            },
            include: {
                turf: true,
                user: true,
            },
        });
        res.status(201).json(createdBooking);
    }
    catch (error) {
        console.error('Failed to create booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});
exports.createBookings = createBookings;
const getBookingsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userEmail } = req.params;
        const bookings = yield prisma.booking.findMany({
            where: {
                userEmail: userEmail,
            },
            select: {
                id: true,
                startTime: true,
                endTime: true,
                totalCost: true,
                status: true,
                turf: {
                    select: {
                        name: true,
                        playground: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json(bookings);
    }
    catch (error) {
        console.error('Failed to get bookings by user:', error);
        res.status(500).json({ error: 'Failed to get bookings by user' });
    }
});
exports.getBookingsByUser = getBookingsByUser;
