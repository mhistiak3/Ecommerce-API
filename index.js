import express from "express";
import router from "./src/routes/api.js"; // Notice the .js extension
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import { APP_PORT } from "./src/config/index.js";
import ErrorHandler from "./src/middlewares/ErrorHandler.js";

const app = express();

let URL = "mongodb://localhost:27017/mern-ecommerce";

mongoose
  .connect(URL)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

app.set("etag", false);
app.use("/api/v1", router);

app.use(express.static("client/dist"));

// Add React Front End Routing
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

// Error Handler
app.use(ErrorHandler);

const PORT = process.env.PORT || APP_PORT;
app.listen(PORT, function () {
  console.log(`Server start on: http://localhost:${PORT}`);
});
