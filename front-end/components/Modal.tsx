import React from "react";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title : string;
  msg: string;
  color : string

}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, title, msg, color }) => {
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`${color} p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-gray-700 mb-6">
          {msg}
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



interface ModalChatProps {
  isOpen: boolean;
  closeModal: () => void;
  name : string;

}

const ModalChat: React.FC<ModalChatProps> = ({ isOpen, closeModal, name }) => {
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-white p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center">New message to ${name}</h2>
        <p className="text-gray-700 mb-6">
          modal
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
 export {ModalChat};