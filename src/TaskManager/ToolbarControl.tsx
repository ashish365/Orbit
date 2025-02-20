import React from "react";

interface ToolbarControlProp {
  onAddTask: () => void;
  onAddCustomField: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onResetTasks: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ToolbarControl: React.FC<ToolbarControlProp> = ({
  onAddTask,
  onAddCustomField,
  onUndo,
  onRedo,
  onResetTasks,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="task-controls">
      <button onClick={onAddTask}>+ Add Task</button>
      <button onClick={onAddCustomField}>+ Add Custom Field</button>
      <button onClick={onUndo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={onRedo} disabled={!canRedo}>
        Redo
      </button>
      <button onClick={onResetTasks} className="reset-button">
        Reset Tasks
      </button>
    </div>
  );
};

export default ToolbarControl;
