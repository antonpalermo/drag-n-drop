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
    throw new Error(error);
  }
}

async function characters() {
  try {
    const characters = await db.query(
      "SELECT * FROM characters ORDER BY rankorder ASC"
    );

    return { count: characters.rowCount, characters: characters.rows };
  } catch (error) {
    throw new Error(error);
  }
}

async function changeOrder(option) {
  try {
    const query = {
      text: "UPDATE characters SET rankorder=$1 WHERE id=$2 RETURNING *",
      values: [option.updatedPosition, option.id],
    };

    const character = await db.query(query);

    console.log(character)

    return character.rows[0];
  } catch (error) {
    throw new Error(error);
  }
}

export default { create, characters, changeOrder };
