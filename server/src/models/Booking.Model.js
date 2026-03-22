import { Schema, model, Types } from "mongoose";

const BookingSchema = new Schema({
    asset: {
        type: Types.ObjectId,
        required: true,
        ref: "Asset"
    },
    project: {
        type: Types.ObjectId,
        ref: "Project",
        default: null
    },
    customer_name: {
        type: String,
        trim: true,
        required: true,
    },
    phone_number: {
        type: Number,
        required: true,
    },
    rented_date: {
        type: Date,
        required: true,
    },
    returned_date: {
        type: Date,
    },
    total_Amount: {
        type: Number,
        required: true,
    },
    returned_status: {
        type: String,
        enum: ["pending", "returned"],
        default: "pending"
    },
    payment_status: {
        type: String,
        enum: ["pending", "partial", "paid"],
        default: "pending"
    }
}, { timestamps: true });

BookingSchema.index({ asset: 1 })
BookingSchema.index({ customer_name: 1 })

export default model("Booking", BookingSchema)