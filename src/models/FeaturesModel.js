const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    
  },
  { timestamps: true, versionKey: false }
);

const FeatureModel = mongoose.model("Feature", DataSchema);

export default FeatureModel;
