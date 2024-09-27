import ProfileModel from "../models/ProfileModel.js";
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
    if (!email) throw Error("No Email send");
    if (!otp) throw Error("No OTP send");

    // save data
    const user = await UserModel.findOne({ email, otp });

    if (!user) throw Error("OTP is incorrect.");

    // create token
    const token = tokenCreate(email, user._id.toString());

    if (!token) throw Error("Token not get.");
    let cookieOption = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: false,
    };
    // Set Cookies With Response
    res.cookie("token", token, cookieOption);

    const existingProfile = await ProfileModel.findOne({
      userID: user._id,
    });

    if (!existingProfile) {
      await ProfileModel.create({ userID: user._id });
    }
    res.json({
      type: "Success",
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    let cookieOption = {
      expires: new Date(Date.now() - 24 * 6060 * 1000),
      httpOnly: false,
    };
    // Set Cookies With Response
    res.cookie("token", "", cookieOption);
    res.json({
      type: "Success",
      message: "Successfully logout",
    });
  } catch (error) {
    next(error);
  }
}

// * Profile *
export async function createProfile(req, res, next) {
  try {
    const { userId } = req.headers;
    const userProfile = req.body;

    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { userID: userId },
      { $set: { ...userProfile } }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        type: "Error",
        message: "Profile not found",
      });
    }

    res.json({
      type: "Success",
      message: "Successfully profile Updated.",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const { userId } = req.headers;

    const updatedProfile = await ProfileModel.findOne({ userID: userId });

    if (!updatedProfile) {
      return res.status(404).json({
        type: "Error",
        message: "Profile not found",
      });
    }

    res.json({
      type: "Success",
      message: "Successfully profile Updated.",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
}
