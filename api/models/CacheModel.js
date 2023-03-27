"use strict";
import mongoose from "mongoose";
import { schema as tripSchema } from "./TripModel.js";

const cacheSchema = new mongoose.Schema(
  {
    explorer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
      required: "Cache explorer required",
    },
    results: [tripSchema]
  },
  { strinct: false, timestamps: true }
);

cacheSchema.index({ explorer_id: 1 });
cacheSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86401 });

const model = mongoose.model("Cache", cacheSchema);

export const schema = model.schema;
export default model;
