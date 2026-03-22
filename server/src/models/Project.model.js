import { Schema, model } from "mongoose";

const ProjectSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    client_name: {
        type: String,
        trim: true,
        required: true,
    },
    phone_number: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        trim: true,
    },
    work_status: {
        type: String,
        enum: ["planning", "in_progress", "completed"],
        default: "planning"
    },
    payment_status: {
        type: String,
        enum: ["pending", "partial", "paid"],
        default: "pending"
    }
}, { timestamps: true });

ProjectSchema.index({ name: 1 });
ProjectSchema.index({ client_name: 1 });

export default model("Project", ProjectSchema);
