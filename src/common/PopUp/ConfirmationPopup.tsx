import React, { useState } from "react";
import "./popup.css";
import { RingLoader } from "react-spinners";

type ConfirmationPopupProps = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = () => {
    setLoading(true);

    setTimeout(() => {
      onConfirm();
      setLoading(false);
    }, 2000);
  };

  if (!isOpen) return null;
  console.log("open");
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{message}</h2>
        <div className="popup-buttons">
          <button onClick={handleConfirmDelete} className="confirm-btn">
            Yes, Delete
          </button>
          <button onClick={onCancel} className="cancel-btn">
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

export default ConfirmationPopup;
