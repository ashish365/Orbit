import React, { useState } from "react";
import "./tabel.css";
import { Task, EditingCustomFields } from "../../utils/types";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import NoTasksFallback from "../NoTask/NoTaskFallback";
import { priorityArray, statusArray } from "../../utils/constants";

type TaskTableProps = {
  tasks: Task[];
  onEdit: (taskId: number, updatedFields: Partial<Task>) => void;
  onRemove: (id: number) => void;
  onSort: (key: keyof Task) => void;
  sortConfig: {
    key: keyof Task | string | null;
    ascending: boolean;
  };
  customField: {
    name: string;
    type: "text" | "number" | "checkbox";
  }[];
  removeCustomField: (fieldName: string) => void;
};

const Table: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onRemove,
  onSort,
  sortConfig,
  customField,
  removeCustomField,
}) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editPriority, setEditPriority] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("");

  // Pagination State
  const [currPage, setCurrPage] = useState(1);
  const [itemEachPage, setItemEachPage] = useState(10);

  const [editingCustomFields, setEditingCustomFields] =
    useState<EditingCustomFields>({});

  // Pagination logic
  const totalPage = Math.ceil(tasks.length / itemEachPage);
  const startInd = (currPage - 1) * itemEachPage;
  const paginatedTask = tasks.slice(startInd, startInd + itemEachPage);

  const handleEdit = (task: Task) => {
    setEditId(task.id);
    setEditText(task.title);
    setEditPriority(task.priority);
    setEditStatus(task.status);

    setEditingCustomFields((prev) => ({
      ...prev,
      [task.id]: { ...task.customFields },
    }));
  };

  const handleCancel = () => {
    setEditId(null);
    setEditingCustomFields({});
  };

  const handleSave = (id: number) => {
    const taskToUpdate = tasks.find((task: Task) => task.id === id);
    if (!taskToUpdate) return;

    onEdit(id, {
      title: editText,
      priority: editPriority,
      status: editStatus,
      customFields: editingCustomFields[id] || {},
    });

    setEditId(null);
  };

  const handleCustomFieldChange = (
    taskId: number,
    fieldName: string,
    value: string | boolean
  ) => {
    setEditingCustomFields((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [fieldName]: typeof value === "boolean" ? value : String(value),
      },
    }));
  };

  if (tasks.length === 0) {
    return <NoTasksFallback />;
  }

  return (
    <div className="table-container">
      <table className="table-task">
        <thead>
          <tr className="table-row">
            <th>ID</th>
            <th>Task Title</th>
            <th
              className={`sortable-header ${
                sortConfig.key === "priority"
                  ? sortConfig.ascending
                    ? "sorted-asc"
                    : "sorted-desc"
                  : ""
              }`}
              onClick={() => onSort("priority")}
            >
              Priority
            </th>
            <th
              className={`sortable-header ${
                sortConfig.key === "status"
                  ? sortConfig.ascending
                    ? "sorted-asc"
                    : "sorted-desc"
                  : ""
              }`}
              onClick={() => onSort("status")}
            >
              Status
            </th>
            {customField.map((field) => (
              <th
                key={field.name}
                className={`sortable-header ${
                  sortConfig.key === field.name
                    ? sortConfig.ascending
                      ? "sorted-asc"
                      : "sorted-desc"
                    : ""
                }`}
                onClick={() => onSort(field.name as keyof Task)}
              >
                {field.name}
                <button
                  onClick={() => removeCustomField(field.name)}
                  className="remove-field"
                >
                  ✖
                </button>
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTask.map((task, index) => (
            <tr key={task.id} className="table-row">
              <td className="single-task">{startInd + index + 1}</td>
              <td className="task-title">
                {editId === task.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                ) : (
                  task.title
                )}
              </td>
              <td className={`priority ${task.priority.toLowerCase()}`}>
                {editId === task.id ? (
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                  >
                    {priorityArray.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                ) : (
                  task.priority
                )}
              </td>
              <td className={`status ${task.status.replace(" ", "-")}`}>
                {editId === task.id ? (
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    {statusArray.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ").charAt(0).toUpperCase() +
                          s.replace("_", " ").slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  task.status.replace("_", " ")
                )}
              </td>
              {customField.map((field) => (
                <td key={field.name}>
                  {editId === task.id ? (
                    field.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={
                          editingCustomFields[task.id]?.[field.name] as boolean
                        }
                        onChange={(e) =>
                          handleCustomFieldChange(
                            task.id,
                            field.name,
                            e.target.checked
                          )
                        }
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={
                          (editingCustomFields[task.id]?.[field.name] as
                            | string
                            | number
                            | undefined) || ""
                        }
                        onChange={(e) =>
                          handleCustomFieldChange(
                            task.id,
                            field.name,
                            e.target.value
                          )
                        }
                      />
                    )
                  ) : // For viewing, render checkbox state as checked/unchecked
                  field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={
                        (task.customFields?.[field.name] as boolean) || false
                      }
                      disabled
                    />
                  ) : (
                    task.customFields?.[field.name]?.toString() || ""
                  )}
                </td>
              ))}
              <td className="task-action">
                {editId === task.id ? (
                  <>
                    <button onClick={() => handleSave(task.id)}>Save</button>
                    <button onClick={handleCancel}>
                      <CancelIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(task)}>
                      <EditIcon />
                    </button>
                    <button onClick={() => onRemove(task.id)}>
                      <DeleteIcon />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <label>Display</label>
        <select
          value={itemEachPage}
          onChange={(e) => {
            setItemEachPage(Number(e.target.value));
            setCurrPage(1);
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div className="navigation">
        <button
          onClick={() => setCurrPage((prev) => Math.max(prev - 1, 1))}
          disabled={currPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currPage} of {totalPage}
        </span>
        <button
          onClick={() => setCurrPage((prev) => Math.min(prev + 1, totalPage))}
          disabled={currPage === totalPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
