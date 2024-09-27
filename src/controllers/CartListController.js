import CartModel from "../models/CartModel.js";

export async function createCart(req, res) {
  const { userId } = req.headers;
  let { productID, qty, color, size } = req.body; 


  if (!productID || !qty || !color || !size) {
    return res.status(400).json({
      type: "fail",
      message: "Missing required fields: productID, qty, color, or size.",
    });
  }

  // Validate that qty is a positive number
  if (qty <= 0) {
    return res.status(400).json({
      type: "fail",
      message: "Quantity must be a positive number.",
    });
  }

  try {
    const cartItem = await CartModel.findOne({
      userId,
      productID,
      color,
      size,
    });

    if (cartItem) {
      cartItem.qty = Number(cartItem.qty) + qty;
      await cartItem.save();
      return res.status(200).json({
        type: "Success",
        message: "Product quantity updated in cart.",
      });
    }

    await CartModel.create({ userId, productID, qty, color, size });

    res.status(201).json({
      type: "Success",
      message: "Successfully added product to cart.",
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({
      type: "Error",
      message: "An error occurred while trying to add the product to the cart.",
    });
  }
}
