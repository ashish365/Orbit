import React from "react";

interface TaskFilterProps {
  filter: {
    title: string;
    priority: string;
    status: string;
  };
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onResetFilter: () => void;
  priorityOptions: string[];
  statusOptions: string[];
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  filter,
  onFilterChange,
  onResetFilter,
  priorityOptions,
  statusOptions,
}) => {
  return (
    <div className="filter">
      <input
        type="text"
        placeholder="Filter by task title"
        name="title"
        value={filter.title}
        onChange={onFilterChange}
      />
      <label>
        Filter by priority
        <select
          name="priority"
          value={filter.priority}
          onChange={onFilterChange}
        >
          <option value="">Select Priority</option>

          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Filter by status
        <select name="status" value={filter.status} onChange={onFilterChange}>
          <option value="">Select Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ").charAt(0).toUpperCase() +
                status.replace("_", " ").slice(1)}
            </option>
          ))}
        </select>
      </label>
      <button onClick={onResetFilter}>Reset Filters</button>
    </div>
  );
};

export default TaskFilter;
