// Require Mongoose
import mongoose, { Schema as _Schema, model } from "mongoose";

// Define a schema
const Schema = _Schema;

const invitationSchema = new Schema({
    calendar: {
        type: mongoose.ObjectId,
        ref: 'Calendar',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
  });

// Compile model from schema
export const InvitationModel = model("Invitation", invitationSchema);