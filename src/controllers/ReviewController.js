import ReviewModel from "../models/ReviewModel.js";

export async function createProductReview(req, res) {}
export async function getProductReview(req, res,next) {
      try {
        const {productId} = req.params;
        const reviweList = await ReviewModel.find({
          productID: productId,
        })

        res.json({
          type: "Success",
          data: reviweList,
          total:reviweList.length
        });
      } catch (error) {
        next(error);
      }
}

