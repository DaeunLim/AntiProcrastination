// Require Mongoose
import mongoose, { Schema as _Schema, model } from "mongoose";
import { DateModel } from "./dateSchema";

// Define a schema
const Schema = _Schema;

const calendarSchema = new Schema({
    owner: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true,
    },
    subscribers: {
        type: [mongoose.ObjectId],
        ref: 'User',
    },
    dates: {
        type: [DateModel.schema],
    },
    date_modified: {
        type: Date,
        default: Date.now(),
    },
  });

// Compile model from schema
export const CalendarModel = model("Calendar", calendarSchema);