import mongoose from "mongoose";
import { z } from "zod";

export const ProjectSchema = z.object({
    name: z
        .string({ required_error: "Project name is required" })
        .min(3, "Project name is too short"),

    client_name: z
        .string({ required_error: "Client name is required" })
        .min(3, "Client name is too short"),

    phone_number: z
        .number({ required_error: "Enter valid phone number", invalid_type_error: "Phone number must be a number" })
        .refine(
            (val) => /^\d{10}$/.test(String(val)),
            { message: "Phone number must be exactly 10 digits" }
        ),

    address: z.string().optional(),

    work_status: z
        .enum(["planning", "in_progress", "completed"], {
            required_error: "Work status is required",
            message: "Work status must be 'planning', 'in_progress' or 'completed'"
        })
        .optional(),

    payment_status: z
        .enum(["pending", "partial", "paid"], {
            required_error: "Payment status is required",
            message: "Payment status must be 'pending', 'partial' or 'paid'"
        })
        .optional(),
});

export const ProjectTransactionSchema = z.object({
    project: z.string({ required_error: "Project ID is required" }).refine(
        (val) => mongoose.Types.ObjectId.isValid(val),
        { message: "Invalid project" }
    ),
    type: z.enum(["income", "expense"], {
        required_error: "Transaction type is required",
        invalid_type_error: "Transaction type must be string"
    }),
    category: z.enum(["labour", "material", "transport", "client payment"], {
        required_error: "Category is required",
        invalid_type_error: "Category must be string",
        message: "Category must be 'labour', 'material', 'transport' or 'client payment'"
    }),
    date: z.coerce.date({ required_error: "Date is required" }),
    amount: z.number({ required_error: "Enter valid amount", invalid_type_error: "Amount must be a number" }),
    description: z.string().optional(),
    payment_type: z.enum(["cash", "cheque", "phonepay"], {
        required_error: "Payment type is required",
        invalid_type_error: "Payment type must be string",
        message: "Payment type must be 'cash', 'cheque' or 'phonepay'"
    })
});
