import {
  Droppable,
  Draggable,
  DropResult,
  DroppableProps,
  DragDropContext,
  ResponderProvided,
} from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { uniqueNamesGenerator, Config, starWars } from "unique-names-generator";

import styles from "./index.module.css";
import Character from "./components/character";
import Lex from "./lib/lexorank";

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animations = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animations);
      setEnabled(false);
    };
  }, []);

  if (!enabled) return null;

  return <Droppable {...props}>{children}</Droppable>;
};

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

  async function onDragEnd(result: DropResult, _: ResponderProvided) {
    if (!result.destination) return;

    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    )
      return;

    // get the source rank order
    const source = characters[result.source.index + 1].rankorder;
    // get the destination rank order
    const destination = characters[result.destination.index + 1].rankorder;

    const updatedPosition = Lex.reposition(source, destination);

    const newTasks = Array.from(characters);
    const [task] = newTasks.splice(result.source.index, 1);

    await fetch(`${endpoint}/characters/reorder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: result.draggableId, updatedPosition }),
    });

    newTasks.splice(result.destination.index, 0, task);
    setCharacters(newTasks);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.container}>
        <div className={styles.rankHeaderContainer}>
          <h1>Ranking</h1>
          <button onClick={createNewCharacter}>New Character</button>
        </div>
        <StrictModeDroppable droppableId="tasks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {characters.map((character, index) => (
                <Draggable
                  index={index}
                  key={character.id}
                  draggableId={character.id}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Character character={character} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </div>
    </DragDropContext>
  );
}
