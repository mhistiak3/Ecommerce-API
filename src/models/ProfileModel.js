import mongoose from "mongoose";
const DataSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    customerAddress: { type: String },
    customerCity: { type: String },
    customerCountry: { type: String },
    customerFax: { type: String },
    customerName: { type: String },
    customerPhone: { type: String },
    customerPostCode: { type: String },
    customerState: { type: String },
    shipAddress: { type: String },
    shipCity: { type: String },
    shipCountry: { type: String },
    shipName: { type: String },
    shipPhone: { type: String },
    shipPostCode: { type: String },
    shipState: { type: String },
  },
  { timestamps: true, versionKey: false }
);

const ProfileModel = mongoose.model("Profile", DataSchema);

export default ProfileModel;
