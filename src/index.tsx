import {
  DndContext,
  DragStartEvent,
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

import { useCallback, useEffect, useState } from "react";
import { uniqueNamesGenerator, Config, starWars } from "unique-names-generator";

import listHelpers from "./lib/list.helpers";
import styles from "./index.module.css";
import Character from "./components/character";

import { Character as CharacterData } from "./lib/list.type";

export default function App() {
  const endpoint =
    process.env.NODE_ENV === "production"
      ? process.env.BACKEND_URL
      : "http://localhost:4545";

  const config: Config = {
    dictionaries: [starWars],
  };

  const [activeCharacter, setActiveCharacter] = useState("");
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

  async function createNewCharacter() {
    const lastCharacter = characters[characters.length - 1];

    const request = await fetch("http://localhost:4545/characters/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: uniqueNamesGenerator(config),
        // rankorder: Lex.assign(lastCharacter && lastCharacter.rankorder),
      }),
    });

    if (!request.ok) {
      return;
    }

    const character = await request.json();
    setCharacters((prevCharacters) => [...prevCharacters, character]);
  }

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      if (event.active) setActiveCharacter(`${active.id}`);
    },
    [setActiveCharacter]
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return;

    setCharacters((prevState) => {
      const sortablePayload = listHelpers.createSortablePayloadByIndex(
        prevState,
        event
      );
      const newRankOrder = listHelpers.getRankInBetween(sortablePayload);
      const newCharacterList = [...prevState];
      const currentCharacterIndex = prevState.findIndex(
        (x) => x.id === sortablePayload.entity.id
      );

      newCharacterList[currentCharacterIndex] = {
        ...newCharacterList[currentCharacterIndex],
        rankorder: newRankOrder.format(),
      };

      return newCharacterList.sort(listHelpers.sortListAsc);
    });

    setActiveCharacter("");
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.rankHeaderContainer}>
        <h1>Ranking</h1>
        <button onClick={createNewCharacter}>New Character</button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
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
