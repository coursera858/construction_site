import { Schema, model } from "mongoose";

const AssetSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    asset_type: {
        type: String,
        trim: true,
        required: true,
        enum: ["vehicle", "tools"]
    },
    image: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    count: {
        type: Number,
        min: 1,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });

AssetSchema.index({ name: 1 })
AssetSchema.index({ asset_type: 1 })

export default model("Asset", AssetSchema)