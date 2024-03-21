import express from "express";

import charactersHandler from "../handlers/characters.js";

const router = express.Router();

// get all chacters
router.get("/", async (req, res) => {});

router.post("/create", async (req, res) => {
  const character = await charactersHandler.create(req.body);
  return res.status(200).json(character);
});

export default router;
