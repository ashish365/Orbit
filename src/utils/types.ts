export type Task = {
  id: number;
  title: string;
  priority: "none" | "low" | "medium" | "high" | "urgent" | string;
  status: "not_started" | "in_progress" | "completed" | string;
  customFields?: Record<string, any>; // Allow any custom fields
};

export type SortConfig = {
  key: keyof Task | string | null;
  ascending: boolean;
};

export type CustomField = {
  name: string;
  type: "text" | "number" | "checkbox";
};

export type EditingCustomFields = {
  [taskId: number]: {
    [fieldName: string]: string | boolean;
  };
};
