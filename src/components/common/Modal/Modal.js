import React, { useRef } from "react";
import "./styles.css";

const Modal = ({
  show,
  title = "Modal title",
  footer,
  children,
  onClose,
  width,
}) => {
  const modalContentRef = useRef(null);

  const handleContainerClick = (e) => {
    if (!modalContentRef.current?.contains(e.target)) {
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className="Modal d-flex flex-column justify-content-center align-items-center"
      onClick={handleContainerClick}
    >
      <div ref={modalContentRef} className="modal__content" style={{ width }}>
        <div className="modal__header">
          <h4 className="modal__title">{title}</h4>
          {onClose && (
            <div className="modal__header__closeBtn" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          )}
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
