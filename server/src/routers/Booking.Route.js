import express from 'express';
import { addBooking, deleteBooking, editBooking, viewAllBooking } from '../controllers/Booking.Controller.js';

const router = express.Router();

router.route("/").get(viewAllBooking).post(addBooking)
router.route("/:bookingId").patch(editBooking).delete(deleteBooking)

export default router