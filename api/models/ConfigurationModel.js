"use strict";
import mongoose from "mongoose";

const configurationSchema = new mongoose.Schema({
  sponsorshipPrice: {
    type: Number,
    required: "Sponsorship price required",
    min: 0.0
  },
  defaultLanguage: {
    type: String,
    default: "en"
  },
  cacheLifeTime: {
    type: Number,
    default: 3600
  },
  paginationSize: {
    type: Number,
    default: 10
  }
}, { strict: false });

const model = mongoose.model("Configuration", configurationSchema);

export const schema = model.schema;
export default model;
