import "dotenv/config";

import cors from "cors";
import express from "express";

import db from "./utils/db.js";
import charactersRoutes from "./routes/characters.js";

async function main() {
  const app = express();
  const port = process.env.PORT || 4545;

  await db.connect();

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/characters", charactersRoutes);

  app.listen(port, () =>
    console.log("Server Running: ", `http://localhost:${port}`)
  );
}

main().catch((e) => console.log("INTERNAL_SERVER_ERROR: ", e));
