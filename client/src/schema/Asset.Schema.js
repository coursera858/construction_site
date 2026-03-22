import { z } from "zod"

export const AssetSchema = z.object({
    name: z
        .string({ required_error: "Asset name is required" })
        .min(4, "Asset name must be atleast 4 characters"),
    asset_type: z
        .enum(["vehicle", "tools"], {
        required_error: "Asset type is required",
        invalid_type_error: "Asset type must be a string",
        message: "Asset type must be either 'vehicle' or 'tools' "
    }),
    count: z.coerce
        .number("Enter valid number")
        .min(1, "Enter valid count"),
    image: z
        .string({ required_error: "Image cannot be empty" })
        .nonempty(),
    description: z
        .string()
        .min(5, "Description cannot be less than 5 characters")
        .optional()
})