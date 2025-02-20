import React, { useState } from "react";
import { RingLoader } from "react-spinners"; // Importing a loader component
import "./customfield.css";

type CustomFieldModalProps = {
  isOpen: boolean;
  onClose: () => void;
  addField: (
    fieldName: string,
    fieldType: "text" | "number" | "checkbox"
  ) => void;
};

const CustomFieldModal: React.FC<CustomFieldModalProps> = ({
  isOpen,
  onClose,
  addField,
}) => {
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<"text" | "number" | "checkbox">(
    "text"
  );
  const [loading, setLoading] = useState(false);

  const handleCreateField = () => {
    if (!fieldName.trim()) return;

    // Show the loader
    setLoading(true);

    // Simulating all the calls and state changes after a timeout (2 seconds)
    setTimeout(() => {
      addField(fieldName, fieldType);
      setFieldName("");
      onClose();
      setLoading(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="custom-field-container">
      <div className="field-content">
        <h2>Add Custom Field</h2>
        <input
          className="field-input"
          type="text"
          placeholder="Enter field name"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          disabled={loading}
        />
        <select
          className="field-type"
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value as any)}
          disabled={loading}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="checkbox">Checkbox</option>
        </select>
        <div className="button-container">
          <button
            className="add-btn"
            onClick={handleCreateField}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
          <button onClick={onClose} className="cancel-btn" disabled={loading}>
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

export default CustomFieldModal;
