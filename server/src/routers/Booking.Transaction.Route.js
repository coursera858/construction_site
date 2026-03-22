import express from 'express';
import { addTransaction, deleteTransaction, editTransaction, getAllTransactions, getBookingDetails } from '../controllers/Booking.Details.Controller.js';


const router = express.Router();

router.route("/transactions").get(getAllTransactions);
router.route("/:bookingId/transaction/").get(getBookingDetails).post(addTransaction)
router.route("/:bookingId/transaction/:transactionId").patch(editTransaction).delete(deleteTransaction);

export default router