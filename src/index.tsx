import {
  Droppable,
  Draggable,
  DropResult,
  DroppableProps,
  DragDropContext,
  ResponderProvided,
} from "react-beautiful-dnd";

import fakes from "./lib/dummy";
import styles from "./index.module.css";

import Task from "./components/task";
import { useEffect, useState } from "react";

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
  function onDragEnd(result: DropResult, provided: ResponderProvided) {
    // TODO:
    console.log(result, provided);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.container}>
        <h1>Tasks</h1>
        <StrictModeDroppable droppableId="tasks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {fakes.tasks.map((task, index) => (
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
