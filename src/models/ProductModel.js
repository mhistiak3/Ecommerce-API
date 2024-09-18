import mongoose  from "mongoose"

const DataSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDes: { type: String, required: true },
    price: { type: String, required: true },
    discount: { type: Boolean, required: true },
    discountPrice: { type: String, required: true },
    image: { type: String, required: true },
    star: { type: String },
    stock: { type: Boolean, required: true },
    remark: { type: String, required: true },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brandID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const ProductModel = mongoose.model("Product", DataSchema);

export default ProductModel;
