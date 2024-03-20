import "dotenv/config";
import express from "express";
import cors from "cors";

import pg from "pg";

async function main() {
  const app = express();
  const port = process.env.PORT || 4545;

  const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  });

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );

  app.get("/", async (_, res) => {
    return res.status(200).json({ message: "Server OK!" });
  });

  app.get("/characters", async (req, res) => {
    let characters = [];

    try {
      await db.connect();
      characters = (await db.query("SELECT * FROM characters")).rows;
      await db.end();
    } catch (error) {
      return res.status(500).send("ERROR GET /characters");
    }

    return res.status(200).json(characters);
  });

  app.listen(port, () =>
    console.log("Server Running: ", `http://localhost:${port}`)
  );
}

main().catch((e) => console.log("INTERNAL_SERVER_ERROR: ", e));
