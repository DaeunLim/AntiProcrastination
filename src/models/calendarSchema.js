// Require Mongoose
import { Schema as _Schema, model } from "mongoose";

// Define a schema
const Schema = _Schema;

const calendarSchema = new Schema({
    owner: {
        type: String,
        required: true,
    },
    subscribers: {
        type: [String],
        required: true,
    },
    dates: {
        type: [String],
        required: true,
    },
    date_modified: {
        type: Date,
        default: Date.now(),
    },
  });

// Compile model from schema
export const CalendarModel = model("Calendar", calendarSchema);