import BrandModel from "../models/BrandModel.js";

 async function getBrandList(req, res) {
    try {
        const brandList = await BrandModel.find({})
        res.json({
          type: "Success",
          brandList,
        });
    } catch (error) {
        console.log(error);
        throw error
        
    }
 }
 async function getProductListByBrand(req, res) {}


export {getBrandList,getProductListByBrand}