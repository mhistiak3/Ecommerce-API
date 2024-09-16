const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Regex for basic email validation
    },
    otp: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const UserModel = mongoose.model("User", DataSchema);

export default  UserModel;
