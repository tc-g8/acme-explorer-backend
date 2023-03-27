"use strict";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Kindly enter the actor name",
    },
    surname: {
      type: String,
      required: "Kindly enter the actor surname",
    },
    email: {
      type: String,
      required: "Kindly enter the actor email",
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      minlength: 5,
      required: "Kindly enter the actor password",
    },
    customToken: {
      type: String
    },
    idToken: {
      type: String
    },
    preferredLanguage: {
      type: String,
    },
    role: [
      {
        type: String,
        required: "Kindly enter the user role(s)",
        enum: ["ADMINISTRATOR", "MANAGER", "EXPLORER", "SPONSOR"],
      },
    ],
    banned: {
      type: Boolean,
      default: false,
    },
  },
  { strict: false }
);

actorSchema.pre("save", function (callback) {
  const actor = this;
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err);

    bcrypt.hash(actor.password, salt, function (err, hash) {
      if (err) return callback(err);
      actor.password = hash;
      callback();
    });
  });
});

actorSchema.pre("findOneAndUpdate", function (callback) {
  const actor = this._update;
  if (actor.password) {
    bcrypt.genSalt(5, function (err, salt) {
      if (err) return callback(err);

      bcrypt.hash(actor.password, salt, function (err, hash) {
        if (err) return callback(err);
        actor.password = hash;
        callback();
      });
    });
  } else {
    callback();
  }
});

actorSchema.methods.verifyPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

const model = mongoose.model("Actor", actorSchema);

export const schema = model.schema;
export default model;
