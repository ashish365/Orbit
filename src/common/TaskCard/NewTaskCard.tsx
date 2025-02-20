import React, { useState } from "react";
import "./TaskCard.css";
import { RingLoader } from "react-spinners";

type TaskCardProps = {
  isOpen: boolean;
  onCreate: (title: string, priority: string, status: string) => void;
  onCancel: () => void;
};

const priorityArray = ["none", "low", "medium", "high", "urgent"];
const statusArray = ["not_started", "in_progress", "completed"];

const NewTaskCard: React.FC<TaskCardProps> = ({
  isOpen,
  onCreate,
  onCancel,
}) => {
  if (!isOpen) return;

  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<string>(priorityArray[0]);
  const [status, setStatus] = useState<string>(statusArray[0]);
  const [loading, setLoading] = useState(false);

  const handleCreateTask = () => {
    if (!title.trim()) {
      alert("title can't be empty");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      onCreate(title, priority, status);
      setTitle("");
      setPriority(priorityArray[0]);
      setStatus(statusArray[0]);
      setLoading(false);
    }, 2000);
  };
  return (
    <div className="card-container">
      <div className="card-body">
        <h2>Create Task</h2>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="card-select-container">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {priorityArray.map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusArray.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ").charAt(0).toUpperCase() +
                  status.replace("_", " ").slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="card-buttons">
          <button onClick={handleCreateTask} className="create">
            Create
          </button>
          <button onClick={onCancel} className="cancel">
            Cancel
          </button>
        </div>
      </div>
      {loading && (
        <div className="overlay">
          <div className="loader-container">
            <RingLoader color="#36d7b7" size={50} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTaskCard;
