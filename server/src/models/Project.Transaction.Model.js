import { Schema, Types, model } from "mongoose";

const ProjectTransactionSchema = new Schema({
    project: {
        type: Types.ObjectId,
        required: true,
        ref: "Project"
    },
    type: {
        type: String,
        trim: true,
        required: true,
        enum: ["income", "expense"],
        default: "expense"
    },
    category: {
        type: String,
        trim: true,
        required: true,
        enum: ["labour", "material", "transport", "client payment"],
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        trim: true
    },
    payment_type: {
        type: String,
        enum: ["cash", "cheque", "phonepay"],
        default: "cash"
    }
}, { timestamps: true });

ProjectTransactionSchema.index({ project: 1 });
ProjectTransactionSchema.index({ date: -1 });

export default model("ProjectTransaction", ProjectTransactionSchema);
