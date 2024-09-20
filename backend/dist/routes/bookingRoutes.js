"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingControllers_1 = require("../controllers/bookingControllers");
const router = (0, express_1.Router)();
router.post('/:playgroundId/book', bookingControllers_1.createBookings);
router.get('/:userEmail/bookings', bookingControllers_1.getBookingsByUser);
exports.default = router;
