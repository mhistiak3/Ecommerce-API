import { JWT_EXPIRE_TIME, JWT_KEY } from "../config/index.js";
import jwt from "jsonwebtoken";
export const tokenCreate = (email, userId) =>
  jwt.sign({ email, userId }, JWT_KEY, { expiresIn: JWT_EXPIRE_TIME });

export const tokenVerify = (token) => {
  try {
    return jwt.verify(token, JWT_KEY);
  } catch (e) {
    return null;
  }
};
