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

export async function getWishList(req, res, next) {
  try {
    const { userId } = req.headers;
    const data = {
      userID: userId,
    };

    const wishList = await WishListModel.find(data).populate({
      path: "productID",
      select: "-createdAt -updatedAt -_id",
    });
    res.json({
      type: "Success",
      data: wishList,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteWish(req, res, next) {
  try {
    const { userId } = req.headers;
    const { productID } = req.params;
    const query = {
      userID: userId,
      productID,
    };
    console.log(query);

    await WishListModel.deleteOne(query);
    res.json({
      type: "Success",
      message: "Successfully deleted",
    });
  } catch (error) {
    next(error);
  }
}
