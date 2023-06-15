import React, { useContext, useRef, useState } from "react";
import { MyContext } from "./Context";

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
  login : string;

}

const ModalChat: React.FC<ModalChatProps> = ({ isOpen, closeModal, name, login }) => {
  const context = useContext(MyContext);
  const value = useRef<HTMLTextAreaElement| null >(null);



  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }
  const sendMsg = () =>{
    if (value.current){
      if (context?.socket){
        context.socket.emit('PrivateMessage', {
          receiver : login,
          content : value.current.value
        })
        context.socket.on('message', (payload: any) => {
          console.log("111111111111111");
          console.log(`Received message: ${payload}`);
          // SetToMessages(payload);
          // setMessages([...messages, payload]);
        });
        context.socket.on('errorMessage', (payload: any) => {
          console.log("22222222222");
  
          console.log(`Received message: ${payload}`);
          // SetToMessages(payload);
          // setMessages([...messages, payload]);
        });
      } 
      closeModal();
    }
  }

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-white p-6 rounded-md flex flex-col gap-3 ` }>
        <h2 className="text-2xl font-bold mb-4 text-center">New message to @{name}</h2>
        <div className="w-full h-[70%] bg-blu-400 flex justify-center ">
        <textarea  ref={value} className=" textarea textarea-ghost h-full w-full max-h-[250px] sm:max-h-[300px]" placeholder="Type a message..."></textarea>
          

        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Close
          </button>
          <button onClick={sendMsg} className="px-4 py-2 bg-blue-500 text-slate-100 rounded hover:bg-blue-800">send message</button>
        </div>
      </div>
    </div>
  );
};

interface ModalChannel{
  isOpen: boolean;
  closeModal: () => void;

}


const ModalCreateChannel: React.FC<ModalChannel> = ({ isOpen, closeModal }) => {
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-white p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Create Channel</h2>
        <div className="bg-red-300 mb-5">kdj</div>
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
 export {ModalChat, ModalCreateChannel};