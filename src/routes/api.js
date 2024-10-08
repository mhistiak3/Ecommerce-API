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
  deleteProductReview,
  getProductReview,
  updateProductReview,
} from "../controllers/ReviewController.js";
import { createProfile, getProfile, login, logout, verifyLogin } from "../controllers/UserController.js";
import AuthMiddleware from "../middlewares/AuthVerification.js";
import { createWish, deleteWish, getWishList } from "../controllers/WishListController.js";
import { createCart, deleteCart, getCartList, updateCart } from "../controllers/CartListController.js";
import { createInvoice, getInvoiceList, getInvoiceProductList, paymentCancel, paymentFail, paymentIPN, paymentSuccess } from "../controllers/InvoiceController.js";

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
router.post("/createProductReview",AuthMiddleware, createProductReview);
router.put("/updateProductReview/:reviewId", AuthMiddleware, updateProductReview);
router.delete(
  "/deleteProductReview/:reviewId",
  AuthMiddleware,
  deleteProductReview
);


// *  *  USER RELATED ROUTES  *  * 
// *  Auth
router.post("/login", login);
router.post("/verifyLogin", verifyLogin);
router.get("/logout",AuthMiddleware, logout);

// *  Profile
router.post("/createProfile", AuthMiddleware, createProfile);
router.post("/updateProfile", AuthMiddleware, createProfile);
router.get("/getProfile", AuthMiddleware, getProfile);

// * WishList *  
router.post("/createWish", AuthMiddleware, createWish);
router.get("/getWishList", AuthMiddleware, getWishList);
router.delete("/deleteWish/:productID", AuthMiddleware, deleteWish);

// * Product Cart *  
router.post("/createCart", AuthMiddleware, createCart);
router.put("/updateCart/:cartId", AuthMiddleware, updateCart);
router.delete("/deleteCart/:cartId", AuthMiddleware, deleteCart);
router.get("/getCartList", AuthMiddleware, getCartList);

// * Invoice * 
router.post("/createInvoice", AuthMiddleware, createInvoice);
router.get("/getInvoiceList", AuthMiddleware, getInvoiceList);
router.get(
  "/getInvoiceProductList/:invoiceId",
  AuthMiddleware,
  getInvoiceProductList
);

// Payment
router.post("/paymentSuccess/:tranId", AuthMiddleware, paymentSuccess);
router.post("/paymentFail/:tranId", AuthMiddleware, paymentFail);
router.post("/paymentCancel/:tranId", AuthMiddleware, paymentCancel);
router.post("/paymentIPN/:tranId", AuthMiddleware, paymentIPN);


export default router;
