import ReviewModel from "../models/ReviewModel.js";

export async function createProductReview(req, res) {
  const { userId } = req.headers; // Extract userId from headers
  const { productID, des, rating } = req.body; // Extract fields from request body

  // Check if essential fields are provided
  if (!productID || !des || !rating) {
    return res.status(400).json({
      type: "fail",
      message: "Missing required fields: productID, description, or rating.",
    });
  }

  try {
    const reviewExists = await ReviewModel.findOne({
      productID,
      userId,
    });

    if (reviewExists) {
      return res.status(400).json({
        type: "fail",
        message: "You have already submitted a review for this product.",
      });
    }

    await ReviewModel.create({ userId, productID, des, rating });

    res.status(201).json({
      type: "Success",
      message: "Successfully created review.",
    });
  } catch (error) {
    
    console.error("Error creating review:", error);
    res.status(500).json({
      type: "Error",
      message: "An error occurred while trying to create the review.",
    });
  }
}


export async function updateProductReview(req, res) {
  const { userId } = req.headers; 
  const { reviewId } = req.params; 
  const reqBody = req.body; 

  try {
    
    const updateResult = await ReviewModel.updateOne(
      { _id: reviewId, userId }, 
      { $set: reqBody }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        type: "Error",
        message: "Review not found or you don't have permission to update it.",
      });
    }

    res.json({
      type: "Success",
      message: "Successfully updated review.",
    });
  } catch (error) {
    // Handle any errors that occur during the update
    console.error("Error updating review:", error);
    res.status(500).json({
      type: "Error",
      message: "An error occurred while trying to update the review.",
    });
  }
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
