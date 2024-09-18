import BrandModel from "../models/BrandModel.js";
import ProductModel from "../models/ProductModel.js";

async function getBrandList(req, res) {
  try {
    const brandList = await BrandModel.find({});
    res.json({
      type: "Success",
      data: brandList,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getProductListByBrand(req, res) {
  try {
    const brandId = req.params.brandId;
     const productList = await ProductModel
     .find({ brandID: brandId })
     .populate({ path: "brandID"} );
   
    res.json({
      type: "Success",
      data: productList,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { getBrandList, getProductListByBrand };
