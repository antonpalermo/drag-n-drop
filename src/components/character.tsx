import styles from "./character.module.css";

export type TaskProps = {
  character: {
    id: number;
    name: string;
  };
};

export default function Character({ character }: TaskProps) {
  return (
    <div className={styles.task}>
      <h2>{character.name}</h2>
    </div>
  );
}
