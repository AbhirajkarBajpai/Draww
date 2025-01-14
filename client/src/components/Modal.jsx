import React from "react";
import "./Modal.css";
const Modal = ({ showModal, closeModal, onConfirm }) => {
  if (!showModal) return null;

  const handleClose = (e) => {
    if (e.target.classList.contains("modal-background_G6")) {
      closeModal();
    }
  };
  const handleGiveUp = () => {
    onConfirm(false);
    closeModal();
  };

  return (
    <div className="modal-background" onClick={handleClose}>
      <div className="modal-container">
        <span>Are you sure you want to give up?</span>
        <div className="modal-buttons">
          <div onClick={closeModal} className="modalBtn YesBtn">No</div>
          <div onClick={handleGiveUp} className="modalBtn NoBtn">
            Yes
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
