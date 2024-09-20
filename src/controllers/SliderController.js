import ProductSliderModel from "../models/ProductSliderModel.js";

export async function getSlider(req, res,next) {
     try {
       const sliderList = await ProductSliderModel.find({});
       res.json({
         type: "Success",
         data: sliderList,
       });
     } catch (error) {
            next(error);
     }
}
