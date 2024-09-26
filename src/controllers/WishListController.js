import WishListModel from "../models/WishListModel.js";

export async function createWish(req, res, next) {
  try {
    const { userId } = req.headers;
    const { productID } = req.body;

    const data = {
      productID,
      userID: userId,
    };

    const isExits = await WishListModel.findOne(data);
    if (!isExits) {
      await WishListModel.create(data);
      return res.json({
        type: "Success",
        message: "Successfully added product in wishlist.",
      });
    }
    res.json({
      type: "Success",
      message: "This product alredy in wishlist",
    });
  } catch (error) {
    next(error);
  }
}
