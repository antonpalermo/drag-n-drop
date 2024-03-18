import {
  Droppable,
  Draggable,
  DropResult,
  DroppableProps,
  DragDropContext,
  ResponderProvided,
} from "react-beautiful-dnd";
import { useEffect, useState } from "react";

import fakes from "./lib/dummy";
import styles from "./index.module.css";

import Task from "./components/task";

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
  const [tasks, setTasks] = useState(fakes.tasks);

  function onDragEnd(result: DropResult, _: ResponderProvided) {
    const { source, destination } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    console.log("old tasks: ", tasks);

    const newTasks = Array.from(tasks);
    const [task] = newTasks.splice(source.index, 1);

    newTasks.splice(destination.index, 0, task);
    setTasks(newTasks);

    console.log("new tasks: ", tasks);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.container}>
        <h1>Tasks</h1>
        <StrictModeDroppable droppableId="tasks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Task task={task} />
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
