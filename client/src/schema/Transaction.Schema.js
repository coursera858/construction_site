import { z } from "zod";

export const TransactionSchema = z.object({
    type: z.enum(["income", "expense"], {
        required_error: "Type is required",
        message: "Type must be either 'income' or 'expense'"
    }),
    category: z.enum(["driver", "petrol", "maintainance", "client payment"], {
        required_error: "Category is required",
        message: "Invalid category"
    }),
    date: z.string({ required_error: "Date is required" }).min(1, "Date is required"),
    amount: z.coerce.number({ 
        required_error: "Amount is required", 
        invalid_type_error: "Amount must be a number" 
    }).min(1, "Amount must be greater than 0"),
    description: z.string().optional().or(z.literal('')),
    payment_type: z.enum(["cash", "cheque", "phonepay"], {
        required_error: "Payment type is required",
        message: "Invalid payment type"
    })
});
