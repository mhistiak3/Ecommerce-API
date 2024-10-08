import { tokenVerify } from "../utility/TokenHelper.js";

const AuthMiddleware = (req, res, next) => {
  let token = req.headers["token"];
  if (!token) {
    token = req.cookies["token"];
  }
  const data = tokenVerify(token);

  if (!data) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }
  req.headers.email = data.email
  req.headers.userId = data.userId
  next()
};

export default AuthMiddleware;
