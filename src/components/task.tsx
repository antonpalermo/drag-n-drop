import classes from "./task.module.css";

export type TaskProps = {
  task: {
    id: string;
    name: string;
  };
};

export default function Task({ task }: TaskProps) {
  return (
    <div className={classes.task}>
      <h2>{task.name}</h2>
    </div>
  );
}
