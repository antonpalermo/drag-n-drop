import styles from "./character.module.css";

export type TaskProps = {
  character: {
    id: string;
    name: string;
    rankorder: string;
    originalorder: number;
  };
};

export default function Character({ character }: TaskProps) {
  return (
    <div className={styles.task}>
      <h2>{character.name}</h2>
      {character.rankorder} - {character.originalorder}
    </div>
  );
}
