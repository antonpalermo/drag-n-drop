import { useMemo } from "react";
import styles from "./character.module.css";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Character as CharacterData } from "../lib/list.type";

export type TaskProps = {
  character: CharacterData;
};

export default function Character({ character }: TaskProps) {
  const { attributes, listeners, transform, transition, setNodeRef } =
    useSortable({ id: character.id });

  const style = useMemo(
    () => ({
      transition,
      transform: CSS.Transform.toString(transform),
    }),
    [transform, transition]
  );

  return (
    <div
      style={style}
      ref={setNodeRef}
      className={styles.task}
      {...attributes}
      {...listeners}
    >
      <h2>{character.name}</h2>
      <p>{character.id}</p>
      {character.rankorder} - {character.originalorder}
    </div>
  );
}
