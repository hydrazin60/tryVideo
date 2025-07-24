import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import { dbConnect } from "../../../db/dbConnection";
const app = express();
dotenv.config();

dbConnect().catch((err) => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);
});
// Middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/assets", express.static(path.join(__dirname, "assets")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  "/upload",
  proxy("http://localhost:5000", {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.timeout = 10000; // 10 second timeout
      return proxyReqOpts;
    },
  })
);
app.use(
  "/import",
  proxy("http://localhost:4444", {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.timeout = 10000; // 10 second timeout
      return proxyReqOpts;
    },
  })
);

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to api_gateway!" });
});

const port = process.env.PORT || 4000;
const host = process.env.HOST ?? "localhost";
app
  .listen(port, () => {
    console.log(`API Gateway running on port:   ${host}:${port}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
