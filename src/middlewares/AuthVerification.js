import { tokenVerify } from "../utility/TokenHelper.js";

const AuthMiddleware = (req, res, next) => {
  let token = req.headers["token"];
  if (!token) {
    token = req.cookies["token"];
  }
  const data = tokenVerify(token);
  console.log(data);

  if (!data) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }
  req.headers.email = data.email
  next()
};

export default AuthMiddleware;
