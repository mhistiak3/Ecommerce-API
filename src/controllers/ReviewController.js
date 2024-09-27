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
  const { userId } = req.headers;
  const { reviewId } = req.params;
  const reqBody = req.body;

  await ReviewModel.updateOne({ _id: reviewId, userId }, { $set: reqBody });

  res.json({
    type: "Success",
    message: "Successfully update review.",
  });
}

export async function deleteProductReview(req, res) {
  const { userId } = req.headers;
  const { reviewId } = req.params;

  try {
    const deletionResult = await ReviewModel.deleteOne({
      _id: reviewId,
      userId,
    });

    if (deletionResult.deletedCount > 0) {
      // Review successfully deleted
      return res.json({
        type: "Success",
        message: "Successfully deleted review.",
      });
    } else {
      // Review not found or not deleted
      return res.status(404).json({
        type: "Error",
        message: "Review not found or you don't have permission to delete it.",
      });
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({
      type: "Error",
      message: "An error occurred while trying to delete the review.",
    });
  }
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
