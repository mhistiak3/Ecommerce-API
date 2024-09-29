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

    // If cart is empty, return failed response
    if (productsFromCart.length === 0) {
      return res
        .status(400)
        .json({ type: "failed", message: "Cart is empty." });
    }

    // Calculate total amount based on product prices and quantities
    let payAmount = productsFromCart.reduce((acc, product) => {
      const price = product.productID.discount
        ? product.productID.discountPrice
        : product.productID.price;
      return acc + price * Number(product.qty);
    }, 0);

    // Calculate VAT (5% of the payable amount)
    let vat = payAmount * 0.05;
    let totalPayable = payAmount + vat;

    // ======= * STEP-2: Retrieve customer and shipping details * ==========
    const profile = await ProfileModel.findOne({ userID: userId });

    // Validate customer profile data
    if (
      !profile ||
      !profile.customerName ||
      !profile.customerAddress ||
      !email
    ) {
      return res.status(400).json({
        type: "failed",
        message: "Missing required customer details.",
      });
    }

    // Construct customer details string
    let customerDetails = `Name: ${profile?.customerName}, Email: ${email}, Address: ${profile?.customerAddress}, Phone: ${profile?.customerPhone}`;

    // Construct shipping details string
    let shipDetails = `Name: ${profile?.shipName}, City: ${profile?.shipCity}, Address: ${profile?.shipAddress}, Phone: ${profile?.shipPhone}`;

    // ======= * STEP-3: Prepare invoice transaction details * ==========
    const tranId = Math.floor(10000000 + Math.random() * 90000000); // Generate unique transaction ID
    let validationId = 0; // Placeholder for validation ID
    let deliveryStatus = "pending";
    let paymentStatus = "pending";

    // ======= * STEP-4: Create the invoice * ==========
    const createdInvoice = await InvoiceModel.create({
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

    // Retrieve invoice ID after creation
    const invoiceId = createdInvoice?._id;

    // ======= * STEP-5: Create invoice products * ==========
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

    // ======= * STEP-6: Payment Setting and SSLCommerz Integration * ==========
    const paymentSetting = await PaymentSettingModel.findOne({});
    if (!paymentSetting) {
      return res.status(500).json({
        type: "failed",
        message: "Payment settings not configured.",
      });
    }

    const {
      storeId,
      storePassword,
      currency,
      successURL,
      failURL,
      cancelURL,
      ipnURL,
      initURL,
    } = paymentSetting;

    const form = new FormData();

    // Append Payment related Info
    form.append("store_id", storeId);
    form.append("store_passwd", storePassword);
    form.append("total_amount", totalPayable);
    form.append("currency", currency);
    form.append("tran_id", tranId);
    form.append("success_url", `${successURL}/${tranId}`);
    form.append("fail_url", `${failURL}/${tranId}`);
    form.append("cancel_url", `${cancelURL}/${tranId}`);
    form.append("ipn_url", `${ipnURL}/${tranId}`);

    // Append Customer related Info
    form.append("cus_name", profile?.customerName);
    form.append("cus_email", email);
    form.append("cus_add1", profile?.customerAddress);
    form.append("cus_city", profile?.customerCity);
    form.append("cus_postcode", profile?.customerPostCode || "N/A");
    form.append("cus_country", profile?.customerCountry);
    form.append("cus_phone", profile?.customerPhone);

    // Append Shipping related Info
    form.append("shipping_method", "YES");
    form.append("num_of_item", productsFromCart.length);
    form.append("weight_of_items", 0.5); // Assuming 0.5kg per order
    form.append("logistic_pickup_id", 545);
    form.append("logistic_delivery_type", "COD");
    form.append("ship_name", profile?.shipName);
    form.append("ship_add1", profile?.shipAddress);
    form.append("ship_city", profile?.shipCity);
    form.append("ship_country", profile?.shipCountry);

    // Append Product related Info
    form.append("product_name", "Computer Accessories");
    form.append("product_category", "Electronic");
    form.append("product_profile", "physical-goods");

    // Set multipart/form-data headers
    const formHeaders = form.getHeaders();

    // ===== * STEP-7: Send Request To SSL Commerz * =====
    const SSLRes = await axios.post(initURL, form, { headers: formHeaders });

    // Check response from SSLCommerz
    if (SSLRes.data.status !== "SUCCESS") {
      console.error("SSLCommerz Payment Error:", SSLRes.data);
      return res.status(400).json({
        type: "failed",
        message: "Payment failed",
        data: SSLRes.data,
      });
    }

    // Send success response
    res.json({
      type: "success",
      message: "Invoice created and payment initiated successfully.",
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

// Payment Success
export const paymentSuccess = async (req, res) => {
  try {
    const { tranId } = req.params;

    // Ensure `tranId` is provided
    if (!tranId) {
      return res.status(400).json({
        type: "Error",
        message: "Transaction ID is missing.",
      });
    }
    // Check if the invoice exists and payment is still pending
    const invoice = await InvoiceModel.findOne({ tranId });

    if (!invoice) {
      return res.status(404).json({
        type: "Error",
        message: "Invoice not found for the provided transaction ID.",
      });
    }

    if (invoice.paymentStatus === "success") {
      return res.status(400).json({
        type: "Error",
        message:
          "Payment has already been marked as successful for this invoice.",
      });
    }

    // Update the invoice's payment status to 'success'
    await InvoiceModel.updateOne(
      { tranId },
      {
        $set: {
          paymentStatus: "success",
        },
      } // Update valId if provided
    );

    res.json({
      type: "Success",
      message: "Payment successfully processed and invoice updated.",
      invoiceId: invoice._id,
      paymentStatus: "success",
    });
  } catch (error) {
    // Log the error and send an error response
    console.error("Error in paymentSuccess:", error);

    res.status(500).json({
      type: "Error",
      message: "An error occurred while trying to process the payment success.",
    });
  }
};
