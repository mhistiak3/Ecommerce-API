
import ProductModel from "../models/ProductModel.js";
import CategoryModel from "../models/CategoryModel.js";
export async function getCategoryList(req, res,next) {
     try {
       const categoryList = await CategoryModel.find({});
       res.json({
         type: "Success",
         data: categoryList,
       });
     } catch (error) {
         next(error);
     }
}
export async function getProductListByCategory(req, res,next) {
    try {
      const categoryId = req.params.categoryId;
      const productList = await ProductModel.find({
        categoryID: categoryId,
      }).populate({ path: "categoryID" });

      res.json({
        type: "Success",
        data: productList,
      });
    } catch (error) {
        next(error);
    }
}
