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

import { LexoRank } from "lexorank";

import fakes from "./lib/dummy";
import styles from "./index.module.css";

import Character from "./components/character";

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

export default function App() {
  const [characters, setCharacters] = useState(fakes.characters);

  const config: Config = {
    dictionaries: [starWars],
  };

  function generateRank() {
    // create and assign initial rank
    let generateNewRank = LexoRank.min().format();

    if (characters.length) {
      const currentRank = LexoRank.parse(
        characters[characters.length - 1].order
      );
      generateNewRank = currentRank.genNext().format();
    }

    return generateNewRank;
  }

  function onTaskCreate() {
    const item = {
      id: characters.length,
      name: uniqueNamesGenerator(config),
      order: generateRank(),
    };
    setCharacters((prevTasks) => [...prevTasks, item]);
  }

  function onDragEnd(result: DropResult, _: ResponderProvided) {
    const { source, destination } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newTasks = Array.from(characters);
    const [task] = newTasks.splice(source.index, 1);

    newTasks.splice(destination.index, 0, task);
    setCharacters(newTasks);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.container}>
        <div className={styles.rankHeaderContainer}>
          <h1>Ranking</h1>
          <button onClick={onTaskCreate}>New Character</button>
        </div>
        <StrictModeDroppable droppableId="tasks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {characters.map((character, index) => (
                <Draggable
                  index={index}
                  key={character.id}
                  draggableId={character.name}
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
