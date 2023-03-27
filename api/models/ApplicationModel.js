"use strict";
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    requestDate: {
      type: Date,
      required: "Application request date required",
      default: Date.now,
    },
    status: {
      type: String,
      required: "Application status required",
      enum: ["PENDING", "DUE", "ACCEPTED", "REJECTED", "CANCELLED"],
      default: "PENDING",
    },
    comment: {
      type: String,
    },
    rejectedReason: {
      type: String,
      default: null,
    },
    trip_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: "Application trip required",
    },
    explorer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
      required: "Application explorer required",
    },
    paidAt: {
      type: Date,
      default: null,
    }
  },
  { strict: false }
);

applicationSchema.index({ explorer_id: 1 });
applicationSchema.index({ trip_id: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ status: 1, paidAt: 1 });

const model = mongoose.model("Application", applicationSchema);

export const schema = model.schema;
export default model;
