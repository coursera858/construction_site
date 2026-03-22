import { z } from "zod"

export const AssetSchema = z.object({
    name: z.string({ required_error: "Asset name is required" })
        .min(4, "Asset name must be at least 4 characters"),
    asset_type: z.enum(["vehicle", "tools"], {
        required_error: "Asset type is required",
        message: "Asset type must be either 'vehicle' or 'tools'"
    }),
    count: z.coerce.number({
        required_error: "Count is required",
        invalid_type_error: "Enter a valid number"
    }).min(1, "Enter valid count"),
    image: z.string({ required_error: "Image cannot be empty" }).min(1, "Image cannot be empty"),
    description: z.string()
        .min(5, "Description cannot be less than 5 characters")
        .optional()
})
