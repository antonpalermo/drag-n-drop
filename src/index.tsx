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
import { useCallback } from "react";
import { uniqueNamesGenerator, Config, starWars } from "unique-names-generator";

import styles from "./index.module.css";
import listHelpers from "./lib/list.helpers";
import Character from "./components/character";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import services from "./services/characters";

export default function App() {
  const client = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ["characters"],
    queryFn: async () => await services.getAllCharacters(),
  });

  const createCharacterMutation = useMutation({
    mutationFn: async () => await createCharacter(),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["characters"] });
    },
  });

  const config: Config = {
    dictionaries: [starWars],
  };

  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function createCharacter() {
    // assign initial lexorank value.
    let currentRank = LexoRank.min().format();

    const characters = data?.characters;

    // check if list exist then generate the next lexorank value.
    if (characters) {
      currentRank = LexoRank.parse(characters[characters.length - 1].rankorder)
        .genNext()
        .format();
    }

    const payload = {
      name: uniqueNamesGenerator(config),
      rankorder: currentRank,
    };

    await services.createNewCharacter(payload);
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) {
      return;
    }

    // setCharacters((prevState) => {
    //   const sortableCharaterList = listHelpers.createSortablePayloadByIndex(
    //     prevState,
    //     event
    //   );

    //   const assignRank = listHelpers.getRankInBetween(sortableCharaterList);

    //   const newList = [...prevState];
    //   const currentCharacterIndex = newList.findIndex(
    //     (x) => x.id === sortableCharaterList.current.id
    //   );

    //   newList[currentCharacterIndex] = {
    //     ...newList[currentCharacterIndex],
    //     rankorder: assignRank.toString(),
    //   };

    //   return newList.sort(listHelpers.sortListAsc);
    // });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.rankHeaderContainer}>
        <h1>Ranking</h1>
        <button onClick={() => createCharacterMutation.mutate()}>
          New Character
        </button>
      </div>
      {!isError ? (
        isPending ? (
          <h1>Loading...</h1>
        ) : (
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <SortableContext
              items={data?.characters}
              strategy={verticalListSortingStrategy}
            >
              {data.characters.map((character) => (
                <Character key={character.id} character={character} />
              ))}
            </SortableContext>
          </DndContext>
        )
      ) : (
        <h1>Oops! Theres an error fetching all available characters</h1>
      )}
    </div>
  );
}
