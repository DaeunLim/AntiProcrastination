// Require Mongoose
import { Schema as _Schema, model } from "mongoose";

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
        type: [String],
    },
  });

// Compile model from schema
export const UserModel = model("User", userSchema);