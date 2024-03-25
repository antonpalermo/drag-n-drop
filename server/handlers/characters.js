import db from "../utils/db.js";

async function create(characters) {
  try {
    const query = {
      text: "INSERT INTO public.characters (name, rankorder) VALUES ($1, $2) RETURNING *",
      values: [characters.name, characters.rankorder],
    };

    const character = await db.query(query);

    return character.rows[0];
  } catch (error) {
    console.log(error);
    await db.end();
    return;
  }
}

async function characters() {
  try {
    const characters = await db.query(
      "SELECT * FROM characters ORDER BY rankorder"
    );

    return { count: characters.rowCount, characters: characters.rows };
  } catch (error) {
    console.log(error);
    await db.end();
    return;
  }
}

export default { create, characters };
