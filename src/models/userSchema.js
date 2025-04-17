// Require Mongoose
import mongoose, { Schema as _Schema, model } from "mongoose";
import { CalendarModel } from "./calendarSchema";

// Define a schema
const Schema = _Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    calendars: {
        type: [mongoose.ObjectId],
        ref: 'Calendar'
    },
  });

// Compile model from schema
export const UserModel = model("User", userSchema);