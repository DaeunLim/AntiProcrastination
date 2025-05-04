// Require Mongoose
import { Schema as _Schema, model } from "mongoose";

// Define a schema
const Schema = _Schema;

const dateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    taskType: {
        type: String,
        required: true,
    },
    to: {
        type: Date,
    },
    from: {
        type: Date,
    },
    priority: {
        type: Number,
        required: true,
        default: 0,
    },
    completed_by: {
        type: [String],
    },
    date_modified: {
        type: Date,
        default: Date.now(),
    },
  });

// Compile model from schema
export const DateModel = model("Date", dateSchema);