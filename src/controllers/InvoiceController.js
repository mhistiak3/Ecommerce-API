import FormData from "form-data";
import CartModel from "../models/CartModel.js";
import InvoiceModel from "../models/InvoiceModel.js";
import InvoiceProductModel from "../models/InvoiceProductModel.js";
import PaymentSettingModel from "../models/PaymentSettingModel.js";
import ProfileModel from "../models/ProfileModel.js";
import axios from "axios";

// Function to create an invoice
export const createInvoice = async (req, res) => {
  try {
    const { userId, email } = req.headers;

    // ======= * STEP-1: Calculate total payable amount and VAT * ==========
    // Retrieve products from the user's cart
    const productsFromCart = await CartModel.find({ userId }).populate({
      path: "productID",
    });
    if (productsFromCart.length === 0) {
      return res.json({ type: "failed" });
    }

    // Calculate the total payable amount based on product prices and quantities
    let payAmount = productsFromCart.reduce((acc, product) => {
      const price = product.productID.discount
        ? product.productID.discountPrice
        : product.productID.price;
      return acc + price * Number(product.qty);
    }, 0);

    // Calculate VAT (5% of the payable amount)
    let vat = payAmount * 0.05;
    // Total amount to be paid including VAT
    let totalPayable = payAmount + vat;

    // ======= * STEP-2: Retrieve customer and shipping details * ==========
    const profile = await ProfileModel.findOne({ userID: userId });

    // Construct customer details string
    let customerDetails = `Name: ${profile?.customerName}, Email: ${email}, Address: ${profile?.customerAddress}, Phone: ${profile?.customerPhone}`;

    // Construct shipping details string
    let shipDetails = `Name: ${profile?.shipName}, City: ${profile?.shipCity}, Address: ${profile?.shipAddress}, Phone: ${profile?.shipPhone}`;

    // ======= * STEP-3: Prepare invoice transaction details * ==========
    const tranId = Math.floor(10000000 + Math.random() * 90000000); // Generate a unique transaction ID
    let validationId = 0; // Placeholder for validation ID
    let deliveryStatus = "pending"; // Initial delivery status
    let paymentStatus = "pending"; // Initial payment status

    // ======= * STEP-4: Create the invoice * ==========
    const createInvoice = await InvoiceModel.create({
      userId,
      payable: payAmount,
      customerDetails,
      shipDetails,
      tranId,
      valId: validationId,
      deliveryStatus,
      paymentStatus,
      total: totalPayable,
      vat,
    });

    // ======= * STEP-5: Create invoice products * ==========
    const invoiceId = createInvoice?._id; // Retrieve the created invoice ID

    // Create invoice products based on cart items
    await Promise.all(
      productsFromCart.map(async (product) => {
        await InvoiceProductModel.create({
          userId,
          invoiceId,
          productId: product?.productID?._id,
          qty: product?.qty,
          price: product.productID.discount
            ? product.productID.discountPrice
            : product.productID.price,
          color: product.color,
          size: product.size,
        });
      })
    );

    // Remove items from the cart after invoice creation
    await CartModel.deleteMany({ userId });

    // ======= * STEP-6: Payment Setting * ==========

    const paymentSatting = await PaymentSettingModel.find({});
    const {
      storeId,
      storePassword,
      currency,
      successURL,
      failURL,
      cancelURL,
      ipnURL,
      initURL,
    } = paymentSatting[0];
    const form = new FormData();


    // Payment related Info
    form.append("store_id", storeId);
    form.append("store_passwd", storePassword);
    form.append("total_amount", totalPayable);
    form.append("currency", currency);
    form.append("tran_id", tranId);
    form.append("success_url", successURL);
    form.append("fail_url", failURL);
    form.append("cancel_url", cancelURL);
    form.append("ipn_url", ipnURL);

    // Customer related Info
    form.append("cus_name", profile?.customerName);
    form.append("cus_email", email);
    form.append("cus_add1", profile?.customerAddress);
    form.append("cus_city", profile?.customerCity);
    form.append("cus_postcode", profile?.customerPostCode);
    form.append("cus_country", profile?.customerCountry);
    form.append("cus_phone", profile?.customerPhone);

    // shiping related Info
    form.append("shipping_method", "YES");
    form.append("num_of_item", productsFromCart.length);
    form.append("weight_of_items", 0.5);
    form.append("logistic_pickup_id", 545);
    form.append("logistic_delivery_type", "COD");
    form.append("ship_name", profile?.shipName);
    form.append("ship_add1", profile?.shipAddress);
    form.append("ship_city", profile?.shipCity);
    form.append("ship_country", profile?.shipCountry);

    // Product related Info
    form.append("product_name", "Computer Accessories");
    form.append("product_category", "Electronic");
    form.append("product_profile", "physical-goods");

    // ===== * STEP-6: Send Request To SSL Commerz * =====
    const SSLRes = await axios.post(initURL, form);

    // Send success response
    res.json({
      type: "success",
      data: SSLRes.data,
    });
  } catch (error) {
    // Log the error and send an error response
    console.error("Error creating invoice:", error);
    res.status(500).json({
      type: "Error",
      message: "An error occurred while trying to create invoice.",
    });
  }
};
