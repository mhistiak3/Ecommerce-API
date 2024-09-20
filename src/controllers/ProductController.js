import ProductDetailsModel from "../models/ProductDetailsModel.js";
import ProductModel from "../models/ProductModel.js";

export async function getProductList(req, res,next) {
  try {
    const productList = await ProductModel.find({});
    res.json({
      type: "Success",
      data: productList,
      total: productList.length,
    });
  } catch (error) {
       next(error);
  }
}
export async function getProductListBySimiler(req, res,next) {
  try {
    const { CategoryID } = req.params;

    const productList = await ProductModel.find({
      categoryID: CategoryID,
    }).populate({
      path: "categoryID",
    });
    res.json({
      type: "Success",
      data: productList,
      total: productList.length,
    });
  } catch (error) {
         next(error);
  }
}
export async function getProductListByKeyWord(req, res,next) {
  try {
    const { Keyword } = req.params;

    const productList = await ProductModel.find({
      $or: [
        { title: { $regex: Keyword, $options: "i" } },
        { shortDes: { $regex: Keyword, $options: "i" } },
      ],
    }).populate({
      path: "categoryID brandID",
    });
    res.json({
      type: "Success",
      data: productList,
      total: productList.length,
    });
  } catch (error) {
       next(error);
  }
}
export async function getProductListByRemerk(req, res,next) {
  try {
    const { Remark } = req.params;

    const productList = await ProductModel.find({
      remark: Remark,
    }).populate({
      path: "categoryID brandID",
    });
    res.json({
      type: "Success",
      data: productList,
      total: productList.length,
    });
  } catch (error) {
         next(error);
  }
}
export async function getProductDetails(req, res,next) {
  try {
    const { productId } = req.params;

    const productDetails = await ProductDetailsModel.findOne({
      productID: productId,
    }).populate({
      path: "productID",
    });
    res.json({
      type: "Success",
      data: productDetails,
    });
  } catch (error) {
       next(error);
  }
}
