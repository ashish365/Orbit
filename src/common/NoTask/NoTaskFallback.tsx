import React from "react";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import "./notask.css";

const NoTasksFallback: React.FC = () => {
  return (
    <div className="no-tasks">
      <h3>No tasks available</h3>
      <p>
        Start by adding a new task! <ContentPasteIcon />
      </p>
    </div>
  );
};

export default NoTasksFallback;
