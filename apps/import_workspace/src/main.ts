import { dbConnect } from "./../../../db/dbConnection";

import express from "express";
import * as path from "path";

const app = express();
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to import_workspace!" });
});

const port = process.env.PORT || 4444;
const host = process.env.HOST ?? "localhost";

dbConnect().catch((err) => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);
});

app
  .listen(port, () => {
    console.log(`import_workspace :   ${host}:${port}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
