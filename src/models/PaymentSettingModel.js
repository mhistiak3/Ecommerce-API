import mongoose from "mongoose";
const DataSchema = new mongoose.Schema(
  {
    storeId: { type: String, required: true },
    storePassword: { type: String, required: true },
    currency: { type: String, required: true },
    successURL: { type: String, required: true },
    failURL: { type: String, required: true },
    cancelURL: { type: String, required: true },
    ipnURL: { type: String, required: true },
    initURL: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const PaymentModel = mongoose.model("Payment", DataSchema);

export default PaymentModel;
