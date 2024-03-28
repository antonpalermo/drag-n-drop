import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  closestCorners,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useCallback, useEffect, useState } from "react";
import { uniqueNamesGenerator, Config, starWars } from "unique-names-generator";

import Lex from "./lib/lexorank";
import styles from "./index.module.css";
import Character from "./components/character";

type CharacterData = {
  id: string;
  name: string;
  rankorder: string;
  originalorder: number;
  [key: string]: any;
};

export default function App() {
  const endpoint =
    process.env.NODE_ENV === "production"
      ? process.env.BACKEND_URL
      : "http://localhost:4545";

  const [characters, setCharacters] = useState<CharacterData[]>([]);

  const config: Config = {
    dictionaries: [starWars],
  };

  useEffect(() => {
    fetch(`${endpoint}/characters`)
      .then((response) => response.json())
      .then((data) => setCharacters(data.characters))
      .catch((error) => console.log("error: ", error));
  }, []);

  async function createNewCharacter() {
    const lastCharacter = characters[characters.length - 1];

    const request = await fetch("http://localhost:4545/characters/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: uniqueNamesGenerator(config),
        rankorder: Lex.assign(lastCharacter && lastCharacter.rankorder),
      }),
    });

    if (!request.ok) {
      return;
    }

    const character = await request.json();
    setCharacters((prevCharacters) => [...prevCharacters, character]);
  }

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log(event);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    console.log(event);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.rankHeaderContainer}>
        <h1>Ranking</h1>
        <button onClick={createNewCharacter}>New Character</button>
      </div>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <SortableContext
          items={characters}
          strategy={verticalListSortingStrategy}
        >
          {characters.map((character) => (
            <Character key={character.id} character={character} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
