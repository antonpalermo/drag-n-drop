import express from "express";

import charactersHandler from "../handlers/characters.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const characters = await charactersHandler.characters();
  return res.status(200).json(characters);
});

router.post("/create", async (req, res) => {
  const character = await charactersHandler.create(req.body);
  return res.status(200).json(character);
});

router.patch("/reorder", async (req, res) => {
  const updatedCharacter = await charactersHandler.changeOrder(req.body);
  return res.status(200).json(updatedCharacter);
});

export default router;
