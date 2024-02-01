// EditConfirmationModal.js

import React, { useState } from 'react';
import './AdminPage.css';

const EditConfirmationModal = ({ data, onConfirm, onCancel }) => {
  const [isModalOpen, setModalOpen] = useState(true);

  const handleConfirm = () => {
    setModalOpen(false);
    onConfirm();
  };

  const handleCancel = () => {
    setModalOpen(false);
    onCancel();
  };

  return (
    <div className={`edit-confirmation-modal${isModalOpen ? ' open' : ''}`}>
      <div className="modal-content">
        <p>Do you want to edit the following data?</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <button onClick={handleConfirm}>Yes</button>
        <button onClick={handleCancel}>No</button>
      </div>
    </div>
  );
};

export default EditConfirmationModal;
