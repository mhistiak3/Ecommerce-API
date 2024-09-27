import ReviewModel from "../models/ReviewModel.js";

export async function createProductReview(req, res) {
  const { userId } = req.headers;
  const { productID, des, rating } = req.body;
  const reviweExit = await ReviewModel.findOne({
    productID,
    userId,
  });
  if (reviweExit) {
    return res.json({
      type: "fail",
      message: "You have already a review in this product ",
    });
  }

  await ReviewModel.create({ userId, productID, des, rating });

  res.json({
    type: "Success",
    message: "Successfully created review.",
  });
}

export async function updateProductReview(req, res) {
  const { reviewId } = req.params;
  const reqBody = req.body;

  await ReviewModel.updateOne({ _id: reviewId }, { $set: reqBody });

  res.json({
    type: "Success",
    message: "Successfully update review.",
  });
}

export async function getProductReview(req, res, next) {
  try {
    const { productId } = req.params;
    const reviweList = await ReviewModel.find({
      productID: productId,
    });

    res.json({
      type: "Success",
      data: reviweList,
      total: reviweList.length,
    });
  } catch (error) {
    next(error);
  }
}
