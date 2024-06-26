import { Character, CharactersResponse } from "../lib/list.type";

const mode = import.meta.env.MODE;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const endpoint = mode === "production" ? backendUrl : "http://localhost:4545";

async function characters(): Promise<CharactersResponse> {
  const request = await fetch(`${endpoint}/characters`);

  if (!request.ok) {
    throw new Error("Unable to fetch all available Characters");
  }

  return await request.json();
}

async function create({
  name,
  rankorder,
}: Pick<Character, "name" | "rankorder">) {
  const request = await fetch(`${endpoint}/characters/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, rankorder }),
  });

  if (!request.ok) {
    throw new Error("Unable to create new character");
  }

  return await request.json();
}

async function updateRankOrder(data: { id: string; updatedPosition: string }) {
  const request = await fetch(`${endpoint}/characters/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: data.id,
      updatedPosition: data.updatedPosition,
    }),
  });

  if (!request.ok) {
    throw new Error("Unable to update character position");
  }

  return await request.json();
}

export default {
  create,
  characters,
  updateRankOrder,
};
