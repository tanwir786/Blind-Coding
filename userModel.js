const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admissionNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    year: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    code1: {
      type: String,
    },
    code2: {
      type: String,
    },
    disqualified: {
      type: Boolean,
    },
  },
  opts
);
module.exports = mongoose.model("User", userSchema);
