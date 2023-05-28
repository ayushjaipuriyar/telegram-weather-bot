// models.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    first_name: String,
    last_name: String,
    username: String,
    type: String,
    subscribed: Boolean,
    blocked: Boolean,
    location: [String],
  },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
