// Require Mongoose
import mongoose, { Schema as _Schema, model } from "mongoose";

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
    invitations: {
        type: [mongoose.ObjectId],
        ref: 'Invitation'
    },
    tasks_completed: {
        type: Number,
        default: 0,
    },
    date_modified: {
        type: Date,
        default: Date.now(),
    }
  });

// Compile model from schema
export const UserModel = model("User", userSchema);