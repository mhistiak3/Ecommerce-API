import UserModel from "../models/UserModel.js";
import EmailSend from "../utility/EmailHelper.js";
import { tokenCreate } from "../utility/TokenHelper.js";

export async function login(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      throw Error("No Email send");
    }
    const code = Math.floor(10000 + Math.random() * 900000);

    // send email
    await EmailSend(email, code);
    // save data
    const userExits = await UserModel.find({ email });
    console.log(userExits);

    if (userExits.length) {
      await UserModel.updateOne({ email }, { $set: { otp: code } });
    } else {
      await UserModel.create({ email, otp: code });
    }

    res.json({
      type: "Success",
      message: "6 digit OTP send to your email, please check it.",
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyLogin(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email) {
      throw Error("No Email send");
    }
    if (!otp) {
      throw Error("No OTP send");
    }

    // save data
    const user = await UserModel.findOne({ email, otp });

    if (!user) {
      throw Error("OTP is incorrect.");
    }

    // create token
    const token = tokenCreate(email);

    res.json({
      type: "Success",
      token,
    });
  } catch (error) {
    next(error);
  }
}
