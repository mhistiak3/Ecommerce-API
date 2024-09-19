import ReviewModel from "../models/ReviewModel.js";

export async function createProductReview(req, res) {}
export async function getProductReview(req, res) {
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
        console.log(error);
        throw error;
      }
}

