import React, { useState } from "react";

function DeleteButton() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmationModal(true);
  };

  const handleDeleteConfirm = () => {
    // Delete logic goes here
    setShowConfirmationModal(false);
  };

  const handleDeleteCancel = () => {
    setShowConfirmationModal(false);
  };

  return (
    <>
      <button onClick={handleDeleteClick}>Delete</button>
      {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this item?</p>
            <button onClick={handleDeleteConfirm}>Yes</button>
            <button onClick={handleDeleteCancel}>No</button>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteButton;
