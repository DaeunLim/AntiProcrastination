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
    type: {
        type: String,
        required: true,
    },
    date_modified: {
        type: Date,
        default: Date.now(),
    },
  });

// Compile model from schema
export const DateModel = model("Date", dateSchema);