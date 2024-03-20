import express, { Express, Request, Response } from "express";

async function main() {
  const app: Express = express();
  const port = parseInt(process.env.PORT!) || 4545;

  app.get("/", (_: Request, res: Response) => {
    return res.status(200).json({ message: "Server OK!" });
  });

  app.listen(port, () =>
    console.log("Server Running: ", `http://localhost:${port}`)
  );
}

main().catch((e) => console.log("INTERNAL_SERVER_ERROR: ", e));
