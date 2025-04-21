// Require Mongoose
import mongoose, { Schema as _Schema, model } from "mongoose";
import { DateModel } from "./dateSchema";

// Define a schema
const Schema = _Schema;

const calendarSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true,
    },
    subscribers: {
        type: [String],
    },
    dates: {
        type: [DateModel.schema],
    },
    invitations: {
        type: [mongoose.ObjectId],
        ref: 'Invitation',
    },
    date_modified: {
        type: Date,
        default: Date.now(),
    },
  });

// Compile model from schema
export const CalendarModel = model("Calendar", calendarSchema);