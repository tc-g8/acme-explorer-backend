"use strict";
import mongoose from "mongoose";

const sponsorshipSchema = new mongoose.Schema({
  banner: {
    type: {
      data: Buffer,
      contentType: String
    },
    required: "Sponsorship banner is required"
  },
  landingPage: {
    type: String,
    required: "Sponsorship landing page required"
  },
  amount: {
    type: Number,
    required: "Sponsorship amount required",
    min: 0
  },
  status: {
    type: String,
    required: "Sponsorship status required",
    enum: ["PENDING", "ACCEPTED", "CANCELLED"],
    default: "PENDING"
  },
  sponsor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Actor",
    required: "Sponsorship sponsor required"
  }
}, { strict: false });

export const schema = sponsorshipSchema;
