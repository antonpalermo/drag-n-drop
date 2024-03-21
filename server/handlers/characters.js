import db from "../utils/db.js";

async function create(characters) {
  try {
    const query = {
      text: "INSERT INTO public.characters (name, rankorder) VALUES ($1, $2) RETURNING *",
      values: [characters.name, characters.rankorder],
    };
    const character = await db.query(query);
    return character.rows;
  } catch (error) {
    console.log(error);
    await db.end();
    return;
  }
}

export default { create };
