import express from "express";
import {
  getBrandList,
  getProductListByBrand,
} from "../controllers/BrandController.js";
import {
  getCategoryList,
  getProductListByCategory,
} from "../controllers/CategoryController.js";
import { getSlider } from "../controllers/SliderController.js";
import {
  getProductDetails,
  getProductList,
  getProductListByKeyWord,
  getProductListByRemerk,
  getProductListBySimiler,
} from "../controllers/ProductController.js";
import {
  createProductReview,
  getProductReview,
} from "../controllers/ReviewController.js";

const router = express.Router();

// *  *  Product Related Routes  *  *
// *  Brands
router.get("/productBrandList", getBrandList);
router.get("/productListByBrand/:brandId", getProductListByBrand);
// * Category
router.get("/productCategoryList", getCategoryList);
router.get("/productListByCategory/:categoryId", getProductListByCategory);
// * Slider
router.get("/productSliderList", getSlider);
// * Product List
router.get("/productList", getProductList);
router.get("/productListSimiler/:CategoryID", getProductListBySimiler);
router.get("/productListKeyWord/:Keyword", getProductListByKeyWord);
router.get("/productListRemerk/:Remark", getProductListByRemerk);
router.get("/productDetails/:productId", getProductDetails);

//  * Review * 
router.get("/productReviewList/:productId", getProductReview);
router.post("/createProductReview/:productId", createProductReview);


// *  *  USER RELATED ROUTES  *  * 
// *  Auth
router.get("/login", loginUser);


export default router;
