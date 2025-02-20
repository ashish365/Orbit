// Helper functions

  const priorityOrder: { [key: string]: number } = {
    none: 0,
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
  };
  
  const statusOrder: { [key: string]: number } = {
    not_started: 0,
    in_progress: 1,
    completed: 2,
  };
  
  export const sortTasksByFilters = (
    tasks: any[],
    sortConfig: { key: string; ascending: boolean },
    filters: { title: string; priority: string; status: string },
    customFieldNames: string[]
  ) => {
    // Apply filtering based on search title, priority, and status
    let filteredTasks = [...tasks].filter((task) => {
      return (
        task.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        (filters.priority === "all" || task.priority === filters.priority) &&
        (filters.status === "all" || task.status === filters.status)
      );
    });
  
    // If sorting is applied
    if (sortConfig.key) {
      filteredTasks.sort((taskA, taskB) => {
        let valueA: any = taskA[sortConfig.key];
        let valueB: any = taskB[sortConfig.key];
  
        // Handle sorting for custom fields
        if (customFieldNames.includes(sortConfig.key)) {
          valueA = taskA.customFields?.[sortConfig.key] ?? "";
          valueB = taskB.customFields?.[sortConfig.key] ?? "";
  
          // Handle boolean fields (checkbox)
          if (typeof valueA === "boolean" && typeof valueB === "boolean") {
            return sortConfig.ascending ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
          }
  
          // Handle number fields
          if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
            return sortConfig.ascending ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
          }
  
          // Handle string fields
          return sortConfig.ascending
            ? valueA.toString().localeCompare(valueB.toString())
            : valueB.toString().localeCompare(valueA.toString());
        }
  
        // Handle priority sorting
        if (sortConfig.key === "priority") {
          valueA = priorityOrder[taskA.priority] ?? 0;
          valueB = priorityOrder[taskB.priority] ?? 0;
        }
  
        // Handle status sorting
        if (sortConfig.key === "status") {
          valueA = statusOrder[taskA.status] ?? 0;
          valueB = statusOrder[taskB.status] ?? 0;
        }
  
        // Fallback check to avoid undefined values
        if (valueA === undefined || valueB === undefined) {
          return valueA === undefined ? 1 : -1;
        }
  
        return sortConfig.ascending ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
      });
    }
  
    return filteredTasks;
  };
  