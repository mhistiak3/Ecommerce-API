import dotenv from 'dotenv'
dotenv.config()
export const {
  APP_PORT,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURITY,
  EMAIL_USER,
  EMAIL_PASS,
  JWT_KEY,
  JWT_EXPIRE_TIME,
} = process.env;

