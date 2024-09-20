import {Router} from 'express';
import { createBookings, getBookingsByUser } from '../controllers/bookingControllers';
const router = Router();

router.post('/:playgroundId/book', createBookings);
router.get('/:userEmail/bookings', getBookingsByUser);
export default router;
