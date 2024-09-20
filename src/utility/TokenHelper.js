import { JWT_EXPIRE_TIME, JWT_KEY } from "../config/index.js";
import jwt from 'jsonwebtoken'
export function tokenCreate(email){
    let KEY = JWT_KEY;
    let EXPIRE = { expiresIn: JWT_EXPIRE_TIME };
    let PAYLOAD = { email: email};
    return jwt.sign(PAYLOAD, KEY, EXPIRE);
}