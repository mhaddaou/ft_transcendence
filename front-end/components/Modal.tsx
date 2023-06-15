import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "./Context";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title : string;
  msg: string;
  color : string

}
import  { ReactNode } from 'react';



const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, title, msg, color }) => {
  const context = useContext(MyContext);
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
            onClick={() =>{
              closeModal()
              context?.setChn(true);
            }}
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
const [msg , setMsg] = useState('');
const [color, setColor] = useState('');
const [title, setTitle] = useState('');
  const context = useContext(MyContext);
  useEffect(() =>{
    if (context?.socket)
    context?.socket.on('message', (pay) =>{
      console.log(pay);
      setMsg(pay);
      setColor('bg-green-400');
      setTitle('Success');
      openModal()
    })
    if (context?.socket)
    context?.socket.on('errorMessage', (pay)=>{
      console.log(pay)
      setMsg(pay.message);
      setColor('bg-orange-400');
      setTitle('Failed');
      openModal()
    })

  }, [context?.socket])

  useEffect(() =>{
    if (context?.chn)
      closeModal()
  }, [context?.chn])

  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  const passref = useRef<HTMLInputElement | null>(null);
  const chanref = useRef<HTMLInputElement | null>(null);
  interface newChannel {
    channelName: string;   // Required
    isPrivate: boolean;    // Required
    ispassword: boolean;   // Required
    password?: string;     // Optional
    }

    const[check, setCheck] = useState(false);
    const [pass,setPass ] = useState(false);
    const clickPass = () =>{
      setPass(!pass);
    }

    const clickcheck = () =>{
      setCheck(!check);
    }

    const Create = () =>{
      if (pass && check){
        var msg : newChannel | string = '';
        if (chanref.current && passref.current){
          msg  = {
            channelName: chanref.current.value,
            isPrivate: check,
            ispassword : pass,
            password: passref.current.value,
          }
        }
        context?.socket?.emit('newChannel',msg)
      // closeModal()

      }
      else if (pass){
        var msg : newChannel | string = '';

        if (chanref.current && passref.current){
          msg  = {
            channelName: chanref.current.value,
            isPrivate: check,
            ispassword : pass,
            password: passref.current.value,
          }

        }
        context?.socket?.emit('newChannel',msg)
      // closeModal()
      openModal();


      }
      else if(check){
        var msg : newChannel | string = '';

        if (chanref.current ){
          const msg : newChannel = {
            channelName: chanref.current.value,
            isPrivate: check,
            ispassword : pass,
            password: '',
          }

          context?.socket?.emit('newChannel',msg)
        }
      // closeModal()

      }
      else{

        var msg : newChannel | string = '';

        if (chanref.current ){
          console.log(chanref.current.value);
          msg  = {
            channelName: chanref.current.value,
            isPrivate: check,
            ispassword : pass,
            password: '',
          }
        }
        context?.socket?.emit('newChannel',msg)
      }
      
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
    const closeModale = () => {
      setIsModalOpen(false);
    };


    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModale} title={title} msg={msg} color={color} />}
      <div className={`bg-white p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-4">Create Channel</h2>
        <div className="bg-re mb-5 flex flex-col gap-2 pt-4">
          <div className="font-semibold font-mono">
            <p >name of channel</p>
            <input type="text" ref={chanref} placeholder="Name Channel" className="input input-bordered input-sm w-full max-w-xs" />
          </div>
          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Password</span> 
              <input type="checkbox" ref={passref} onClick={clickPass} checked={pass} className="checkbox" />
            </label>
          </div>
          <input type="password" placeholder="Password" className="input input-bordered input-sm w-full max-w-xs" />

         
          
          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Private Channel</span> 
              <input type="checkbox" onClick={clickcheck} checked={check} className="checkbox" />
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={Create}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};


export default Modal;
 export {ModalChat, ModalCreateChannel};

//  <div className="font-semibold font-mono">
//             <p>password</p>
//             <input type="text" placeholder="password" className="input input-bordered input-sm w-full max-w-xs" />
//           </div>