import mongoose from "mongoose";
import { z } from "zod";

export const BookingSchema = z.object({
    asset: z
        .string({ required_error: "Asset ID is required" })
        .refine(
            (val) => mongoose.Types.ObjectId.isValid(val),
            { message: "Invalid asset" }
        ),

    project: z
        .string()
        .refine(
            (val) => !val || mongoose.Types.ObjectId.isValid(val),
            { message: "Invalid project" }
        )
        .optional()
        .or(z.literal('')),

    customer_name: z
        .string({ required_error: "Customer name should not be empty" })
        .min(3, "customer name is too short"),

    phone_number: z
        .number({ required_error: "Enter valid phone number", invalid_type_error: "Phone number must be a number" })
        .refine(
            (val) => /^\d{10}$/.test(String(val)),
            { message: "Phone number must be exactly 10 digits" }
        ),

    total_Amount: z
        .number({ required_error: "Enter valid amount", invalid_type_error: "amount must be a number" }),

    rented_date: z.coerce.date({ required_error: "Rented date is required" }),

    returned_date: z.coerce.date().optional(),

    returned_status: z
        .enum(["pending", "returned"], {
            required_error: "Enter valid return date",
            invalid_type_error: "Return status must be a string",
            message: "Returned Status must be either 'pending' or 'returned' "
        })
        .optional(),

    payment_status: z
        .enum(["pending", "partial", "paid"], {
            required_error: "Payment status is required",
            invalid_type_error: "Payment status must be a string",
            message: "Payment Status must be either 'pending' or 'partial' or 'paid' "
        })
        .optional(),
})

export const BookingTransactionSchema = z.object({
    booking: z.string({ required_error: "Booking ID is required" }).refine(
        (val) => mongoose.Types.ObjectId.isValid(val),
        { message: "Invalid booking" }
    ),
    type: z.enum(["income", "expense"], {
        required_error: "Transaction type is required",
        invalid_type_error: "Transcation type must be string"
    }),
    category: z.enum(["driver", "petrol", "maintainance", "client payment"], {
        required_error: "Payment type is required",
        invalid_type_error: "Payment type must be string",
        message: "Payment Status must be either 'driver' or 'petrol' or 'maintainance' or 'client payment' "
    }),
    date: z.coerce.date({ required_error: "payment date is required" }),
    amount: z.number({ required_error: "Enter valid amount", invalid_type_error: "amount must be a number" }),
    description: z.string().optional()
    , payment_type: z.enum(["cash", "cheque", "phonepay"], {
        required_error: "Payment type is required",
        invalid_type_error: "Payment type must be string",
        message: "Payment Status must be either 'cash' or 'cheque' or 'phonepay' "
    })
})