import mongoose from "mongoose";
const DataSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    payable: { type: String, required: true },
    customerDetails: { type: String, required: true },
    shipDetails: { type: String, required: true },
    tranId: { type: String, required: true },
    valId: { type: String, required: true },
    deliveryStatus: { type: String, required: true },
    payementStatus: { type: String, required: true },
    total: { type: String, required: true },
    vat: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const InvoiceModel = mongoose.model("Invoice", DataSchema);

export default InvoiceModel;
