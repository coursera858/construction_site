import {z} from "zod";

export const RegisterSchema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters"),

    password: z
        .string({ required_error: "Password is required" })
        .min(5, "Password must be at least 5 characters")
        .max(10, "Password must be at most 10 characters"),

    email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email"),
});

export const LoginSchema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters"),

    password: z
        .string({ required_error: "Password is required" })
        .min(5, "Password must be at least 5 characters")
        .max(10, "Password must be at most 10 characters"),
});