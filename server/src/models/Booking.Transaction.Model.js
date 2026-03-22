
import { Schema, Types, model } from "mongoose";
const BookingTransactionSchema = new Schema({
    booking: {
        type: Types.ObjectId,
        required: true,
        ref: "Booking"
    },
    type: {
        type: String,
        trim: true,
        required: true,
        enum: ["income", "expense"],
        default: "expense"
    },
    category: {
        type: String,
        trim: true,
        required: true,
        enum: ["driver", "petrol", "maintainance", "client payment"],
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        trim: true
    },
    payment_type: {
        type: String,
        enum: ["cash", "cheque", "phonepay"],
        default: "pending"
    }
}, { timestamps: true });

BookingTransactionSchema.index({ asset: 1 });
BookingTransactionSchema.index({ date: -1 });

export default model("BookingTransaction", BookingTransactionSchema);