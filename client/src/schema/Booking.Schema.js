import { z } from "zod";

export const BookingSchema = z.object({
    asset: z.string({ required_error: "Asset is required" }).min(1, "Asset is required"),
    project: z.string().optional().or(z.literal('')),
    customer_name: z
        .string({ required_error: "Customer name is required" })
        .min(3, "Customer name must be at least 3 characters"),
    phone_number: z.coerce.number({ 
        required_error: "Phone number is required", 
        invalid_type_error: "Phone number must be a number" 
    }).refine(
        (val) => /^\d{10}$/.test(String(val)),
        { message: "Phone number must be exactly 10 digits" }
    ),
    total_Amount: z.coerce.number({ 
        required_error: "Total amount is required", 
        invalid_type_error: "Amount must be a number" 
    }),
    rented_date: z.string({ required_error: "Rented date is required" }).min(1, "Rented date is required"),
    returned_date: z.string().optional().or(z.literal('')),
    returned_status: z
        .enum(["pending", "returned"], {
            required_error: "Return status is required",
            message: "Status must be either 'pending' or 'returned'"
        })
        .default("pending"),
    payment_status: z
        .enum(["pending", "partial", "paid"], {
            required_error: "Payment status is required",
            message: "Status must be either 'pending', 'partial' or 'paid'"
        })
        .default("pending"),
});
