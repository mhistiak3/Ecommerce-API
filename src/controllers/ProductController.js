import ProductModel from "../models/ProductModel.js";

export async function getProductList(req, res) {
  try {
    const productList = await ProductModel.find({});
    res.json({
      type: "Success",
      data: productList,
      total: productList.length,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getProductListBySimiler(req, res) {
  try {
    const { CategoryID } = req.params;

    const productList = await ProductModel.find({
      categoryID: CategoryID,
    }).populate({
      path: "categoryID",
    });
    res.json({
      type: "Success",
      data: productList,
      total: productList.length,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getProductListByKeyWord(req, res) {
  try {
    const { Keyword } = req.params;

    const productList = await ProductModel.find({
      $or: [
        { title: { $regex: Keyword, $options: "i" } },
        { shortDes: { $regex: Keyword, $options: "i" } },
      ],
    }).populate({
      path: "categoryID brandID",
    });
    res.json({
      type: "Success",
      data: productList,
      total: productList.length,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getProductListByRemerk(req, res) {
      try {
        const { Remark } = req.params;

        const productList = await ProductModel.find({
          remark: Remark,
        }).populate({
          path: "categoryID brandID",
        });
        res.json({
          type: "Success",
          data: productList,
          total: productList.length,
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
}
export async function getProductDetails(req, res) {}
