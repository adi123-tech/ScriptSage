import React from 'react';
import './Modal.css';

function Modal({ show, handleClose, children }) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose}>
                    &times;
                </button>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
