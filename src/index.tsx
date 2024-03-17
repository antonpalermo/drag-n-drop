import Task from "./components/task";
import fakes from "./lib/dummy";

import styles from "./index.module.css";

export default function App() {
  return (
    <div className={styles.container}>
      <h1>Tasks</h1>
      {fakes.tasks.map((task) => (
        <Task task={task} />
      ))}
    </div>
  );
}
