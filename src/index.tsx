import {
  DndContext,
  DragEndEvent,
  closestCorners,
  useSensor,
  useSensors,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { LexoRank } from "lexorank";
import { useCallback, useEffect, useState } from "react";
import { uniqueNamesGenerator, Config, starWars } from "unique-names-generator";

import styles from "./index.module.css";
import listHelpers from "./lib/list.helpers";
import Character from "./components/character";

import { Character as CharacterData } from "./lib/list.type";

const mode = import.meta.env.MODE;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const endpoint = mode === "production" ? backendUrl : "http://localhost:4545";

  const config: Config = {
    dictionaries: [starWars],
  };

  const [characters, setCharacters] = useState<CharacterData[]>([]);

  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch(`${endpoint}/characters`)
      .then((response) => response.json())
      .then((data) => setCharacters(data.characters))
      .catch((error) => console.log("error: ", error));
  }, []);

  async function createCharacter() {
    // assign initial lexorank value.
    let currentRank = LexoRank.min().format();

    // check if list exist then generate the next lexorank value.
    if (characters.length) {
      currentRank = LexoRank.parse(characters[characters.length - 1].rankorder)
        .genNext()
        .format();
    }

    // send the request to create new character with corresponding route.
    const request = await fetch(`${endpoint}/characters/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: uniqueNamesGenerator(config),
        rankorder: currentRank,
      }),
    });

    if (!request.ok) {
      return;
    }

    const character = await request.json();
    // update the local state
    setCharacters((prevState) => {
      const newCharacterSet = [...prevState, character];
      // return the sorted list of new array.
      return newCharacterSet.sort(listHelpers.sortListAsc);
    });
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) {
      return;
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.rankHeaderContainer}>
        <h1>Ranking</h1>
        <button onClick={createCharacter}>New Character</button>
      </div>
      <DndContext
        sensors={sensors}
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
