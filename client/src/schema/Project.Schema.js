import { z } from "zod";

export const ProjectSchema = z.object({
    name: z
        .string({ required_error: "Project name is required" })
        .min(3, "Project name must be at least 3 characters"),
    client_name: z
        .string({ required_error: "Client name is required" })
        .min(3, "Client name must be at least 3 characters"),
    phone_number: z.coerce.number({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a number"
    }).refine(
        (val) => /^\d{10}$/.test(String(val)),
        { message: "Phone number must be exactly 10 digits" }
    ),
    address: z.string().optional().or(z.literal('')),
    work_status: z
        .enum(["planning", "in_progress", "completed"], {
            required_error: "Work status is required",
            message: "Invalid work status"
        })
        .default("planning"),
    payment_status: z
        .enum(["pending", "partial", "paid"], {
            required_error: "Payment status is required",
            message: "Invalid payment status"
        })
        .default("pending"),
});
