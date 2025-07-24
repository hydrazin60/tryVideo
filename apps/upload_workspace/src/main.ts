import express from "express";
import path from "path";
import { dbConnect } from "../../../db/dbConnection";
const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = express();
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.send({ message: "welcome to upload_workspace" });
});
dbConnect().catch((err) => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);
});

app
  .listen(port, () => {
    console.log(`upload_workspace: ${host}:${port}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
