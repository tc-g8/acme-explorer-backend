"use strict";
import mongoose from "mongoose";

const stageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Stage title required"
  },
  description: {
    type: String,
    required: "Stage description required"
  },
  price: {
    type: Number,
    required: "Stage price required",
    min: 0.0
  }
}, { strict: false });

export const schema = stageSchema;
