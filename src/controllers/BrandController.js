import BrandModel from "../models/BrandModel.js";
import ProductModel from "../models/ProductModel.js";

async function getBrandList(req, res,next) {
  try {
    const brandList = await BrandModel.find({});
    res.json({
      type: "Success",
      data: brandList,
    });
  } catch (error) {
      next(error);
  }
}
async function getProductListByBrand(req, res,next) {
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
        next(error);
  }
}

export { getBrandList, getProductListByBrand };
