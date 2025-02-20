import React, { useEffect, useState } from "react";
import Table from "../common/TaskTable/Table";
import { Task, SortConfig, CustomField } from "../utils/types";
import {
  priorityArray,
  statusArray,
  defaultFilter,
  mockTasks,
} from "../utils/constants";
import ConfirmationPopup from "../common/PopUp/ConfirmationPopup";
import NewTaskCard from "../common/TaskCard/NewTaskCard";
import { sortTasksByFilters } from "../utils/helper";
import CustomFieldModal from "../common/CustomField/CustomFieldModal";
import ToolbarControl from "./ToolbarControl";
import TaskFilter from "./TaskFilter";
import DeblurIcon from "@mui/icons-material/Deblur";
import "./TaskManager.css";

const TaskManager: React.FC<any> = () => {
  const initialData = mockTasks;

  const [tasks, setTasks] = useState<Task[]>([]); // original task list (initally set to mock-data on mounting)

  const [filteredTask, setFilteredTask] = useState<Task[]>([]); // filtered task list for rendering the list
  console.log("🚀 ~ filteredTask:", filteredTask);

  const [history, setHistory] = useState<Task[][]>([]); //undo state
  const [future, setFuture] = useState<Task[][]>([]); // redo state

  const [openModal, setOpenModal] = useState<boolean>(false); // flag for Delete modal
  const [deleteTask, setDeleteTask] = useState<number | null>(null);

  const [createTask, setCreateTask] = useState<boolean>(false); // for new task creation
  const [openCustomFieldModal, setOpenCustomFieldModal] =
    useState<boolean>(false); //flag for custom field modal

  const [customField, setCustomField] = useState<CustomField[]>([]);

  const [isAddingCustomField, setIsAddingCustomField] = useState(false);

  // When adding a custom field, set this flag

  const [filter, setFilter] = useState(defaultFilter); // filter type state

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    ascending: true,
  });

  const createCustomField = (
    fieldName: string,
    fieldType: "text" | "number" | "checkbox"
  ) => {
    //Check for duplicate field
    const isIdentical = customField.some(
      (field) => field.name === fieldName && field.type === fieldType
    );

    if (isIdentical) {
      alert("Custom field with the same name and type already exists!");
      return;
    }

    setCustomField((prevFields) => [
      ...prevFields,
      { name: fieldName, type: fieldType }, // Correctly add the type
    ]);

    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => ({
        ...task,
        customFields: {
          ...task.customFields,
          [fieldName]:
            fieldType === "checkbox" ? false : fieldType === "number" ? 0 : "",
        },
      }));
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      setFilteredTask(newTasks);
      return newTasks;
    });
  };

  const removeCustomField = (fieldName: string) => {
    setCustomField((prevFields) =>
      prevFields.filter((field) => field.name !== fieldName)
    );

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        const updatedFields = { ...task.customFields };
        delete updatedFields[fieldName];
        return { ...task, customFields: updatedFields };
      });

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setFilteredTask(updatedTasks);
      return updatedTasks;
    });
  };

  // Save past state before modifying tasks
  const updateTasks = (newTasks: Task[]) => {
    setHistory((prevHistory) => [...prevHistory, tasks]);
    setFuture([]); // Clear redo history on new action
    setTasks(newTasks);
    setFilteredTask(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const handleEditTask = (taskId: number, updatedFields: Partial<Task>) => {
    updateTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setDeleteTask(id);
    setOpenModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTask !== null) {
      updateTasks(tasks.filter((task) => task.id !== deleteTask));
      setOpenModal(false);
      setDeleteTask(null);
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setDeleteTask(null);
  };

  const handleCreateNewtask = (
    title: string,
    priority: string,
    status: string
  ) => {
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1, // Generate sequential ID
      title,
      priority,
      status,
      customFields: {}, // Initializing customFields as an empty object
    };
    updateTasks([...tasks, newTask]);
    setCreateTask(false);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setFuture((prevFuture) => [tasks, ...prevFuture]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setTasks(previousState);
      setFilteredTask(previousState);
      localStorage.setItem("tasks", JSON.stringify(previousState));
    }
  };

  const handleRedo = () => {
    if (future.length > 0) {
      const nextState = future[0];
      setHistory((prevHistory) => [...prevHistory, tasks]);
      setFuture((prevFuture) => prevFuture.slice(1));
      setTasks(nextState);
      setFilteredTask(nextState);
      localStorage.setItem("tasks", JSON.stringify(nextState));
    }
  };

  // function to handle different filters
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name !== "title" && value === "") {
      alert("this is not a filter type, Reset filter to get default list");
      return;
    }

    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  // this function handles resetting filter, filtered task list and sorting configuration
  const handleResetFilter = () => {
    setFilter(defaultFilter);
    setFilteredTask(tasks);
    setSortConfig({ key: null, ascending: true });
  };

  // Get tasks using local persistance
  const loadTasksFromLocalStorage = (
    setTasks: (tasks: Task[]) => void,
    setFilteredTask: (tasks: Task[]) => void,
    setCustomField: (
      fields: { name: string; type: "text" | "checkbox" }[]
    ) => void,
    initialData: Task[]
  ) => {
    const availableTasks = localStorage.getItem("tasks");

    if (availableTasks) {
      const loadedTasks = JSON.parse(availableTasks);

      // Ensure customFields are initialized correctly
      const initializedTasks = loadedTasks.map((task: Task) => ({
        ...task,
        customFields: task.customFields ?? {}, // Default to an empty object
      }));

      setTasks(initializedTasks);
      setFilteredTask(initializedTasks);

      // Extracting unique custom field names
      const loadedCustomFields = initializedTasks.reduce(
        (acc: string[], task: Task) => {
          if (task.customFields && typeof task.customFields === "object") {
            Object.keys(task.customFields).forEach((key) => {
              if (!acc.includes(key)) acc.push(key);
            });
          }
          return acc;
        },
        []
      );

      // Mapping custom fields to their correct types
      const customFieldsWithTypes = loadedCustomFields.map(
        (fieldName: string) => {
          const field = initializedTasks[0].customFields[fieldName]; // Get the first task's field type
          return {
            name: fieldName,
            type: typeof field === "boolean" ? "checkbox" : "text", // Check if the field is a boolean
          };
        }
      );

      setCustomField(customFieldsWithTypes); // Set the custom fields with types
    } else {
      setTasks(initialData);
      setFilteredTask(initialData);
    }
  };

  useEffect(() => {
    loadTasksFromLocalStorage(
      setTasks,
      setFilteredTask,
      setCustomField,
      initialData
    );
  }, []);

  // local persistence - set tasks
  useEffect(() => {
    if (tasks.length) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    setFilteredTask(tasks);
  }, [tasks]);

  const handleSort = (key: keyof Task | string) => {
    setSortConfig((prev) => ({
      key,
      ascending: prev.key === key ? !prev.ascending : true,
    }));
  };

  // this useEffect triggers when any of the dependencies change,
  // sortTask is imported from a helper functions where a genric sort functions is written based on our conditions

  useEffect(() => {
    if (!isAddingCustomField) {
      const sortedTasks = sortTasksByFilters(
        tasks,
        sortConfig as { key: string; ascending: boolean },
        filter,
        customField.map((field) => field.name)
      );
      // setFilteredTask(sortedTasks);
      setFilteredTask([...sortedTasks].reverse()); // Ensure new tasks appear at the top
    } else {
      // Resetting the flag after a short delay, so sorting doesn't occur immediately
      setTimeout(() => setIsAddingCustomField(false), 0);
    }
  }, [tasks, filter, sortConfig, customField, isAddingCustomField]);

  // Resetting entire table
  const handleResetTasks = () => {
    if (tasks.length > 0) {
      setHistory((prevHistory) => [...prevHistory, tasks]); // Save the current state before reset
      setFuture([]); // Clear redo history
      setTasks([]);
      setFilteredTask([]);
      localStorage.setItem("tasks", JSON.stringify([]));
    }
  };

  return (
    <div className="task-manager">
      <h1>
        <DeblurIcon /> Orbit - keep your tasks in motion
      </h1>
      {/* Action control component */}
      <ToolbarControl
        onAddTask={() => setCreateTask(true)}
        onAddCustomField={() => setOpenCustomFieldModal(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onResetTasks={handleResetTasks}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
      />
      {/* Filter cotrol */}
      <TaskFilter
        filter={filter}
        onFilterChange={handleFilterChange}
        onResetFilter={handleResetFilter}
        priorityOptions={priorityArray}
        statusOptions={statusArray}
      />
      {/* Task Table  */}
      <div>
        <Table
          tasks={filteredTask}
          onEdit={handleEditTask}
          onRemove={handleDeleteTask}
          onSort={handleSort}
          sortConfig={sortConfig}
          customField={customField}
          removeCustomField={removeCustomField}
        />
      </div>
      {/* New task creation modal */}

      <NewTaskCard
        isOpen={createTask}
        onCreate={handleCreateNewtask}
        onCancel={() => setCreateTask(false)}
      />

      {/* Delete taks confirmation */}

      <ConfirmationPopup
        isOpen={openModal}
        message="Are you sure you want to delete this task?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
      />

      {/* Custom field creation modal */}

      <CustomFieldModal
        isOpen={openCustomFieldModal}
        onClose={() => setOpenCustomFieldModal(false)}
        addField={createCustomField}
      />
    </div>
  );
};

export default TaskManager;
