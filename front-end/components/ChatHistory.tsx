import React, { useState, useEffect, useContext, useRef } from "react";
import { FiSend } from 'react-icons/fi';
import anim from '../image/chatanim.json'
import Image, { StaticImageData } from "next/image";
import Lottie from "lottie-react";
import Avatar from "./Avatar";
import axios from "axios";
import mhaddaou from '../image/mhaddaou.jpg'
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import InfoContact from "./InfoContact";
import { MyContext, MesgType } from "./Context";
import { element } from "prop-types";
import Notification from './Notification'
import { Stack } from "@mui/material";
import { useRouter } from 'next/router';
import Router from "next/router";

import ChannelHistor from "./ChannelHistory";
import { ModalInvite } from '@/components/Modal';

const Sender = ({ msg }: { msg: string }) => {
  
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image src={mhaddaou} alt="av" />
        </div>
      </div>
      
      <div className="chat-bubble">{msg}</div>
          
    </div>
  );
};

const Reciever = ({ msg }: { msg: string }) => {
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image src={mhaddaou} alt="av" />
        </div>
      </div>
      <div className="chat-bubble bg-slate-400">{msg}</div>
    </div>
  );
};

const AvatarOffline = ({ img }: { img: StaticImageData }) => {
  return (
    <div className="avatar offline">
      <div className="w-14 rounded-full">
        <Image src={img} alt="avatar" />
      </div>
    </div>
  );
};

const AvatarOnline = ({ img }: { img: StaticImageData }) => {
  return (
    <div className="avatar online">
      <div className="w-14 rounded-full">
        <Image src={img} alt="avatar" />
      </div>
    </div>
  );
};

interface IMessage {
  content: string;
  fromUserA: boolean;
  sendAt: string;
}

export default function ChatHistory({ chatHistory, login }: { chatHistory: MesgType[], login: string }) {
  const context = useContext(MyContext);
  const [newMsg, setNewMsg] = useState<MesgType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameRoom, setGameRoom] = useState("")

  useEffect(() => {
    if (gameRoom.length)
      setIsModalOpen(true)
  }, [gameRoom])
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setNewMsg(chatHistory);
  }, [chatHistory]);
  useEffect(() => {
    if (context?.socket) {
      context.socket.on('PrivateMessage', (payload: any) => {
        if (payload) {
          setNewMsg((prevMsgs) => [...prevMsgs, payload]);
        }
        if (!document.hidden) {
          // Show a notification
          console.log('newMsg')
        }
        else
          console.log("msg and not in this page");
      });

      context.socket.on('gameInvitation', (payload: any) => {
   
        console.log("game invite response ")
        if (payload && payload.sender) {
          setGameRoom(payload.sender)
          setIsModalOpen(true)

        }
        console.log(payload)
      });
    }
  
    return () => {
      if (context?.socket) {
        context.socket.off('PrivateMessage');
        context.socket.off('gameInvitation');

      }
    };
  }, [context?.socket]);
  

  const createObject = (msg: string) => {
    const l = context?.MessageInfo?.loginA !== login;
    return {
      content: msg,
      fromUserA: l,
      sendAt: new Date().toISOString(),
    };
  };
  // export interface MesgType{
  //   content : string;
  //   sendAt: string;
  //   loginSender: string;
  //   loginReceiver: string;
  //   fromUserA: boolean;
  // }

  const sendMsg = () => {
  
    if (context?.socket) {
      if (inputValue !== '') {
        context.socket.emit('PrivateMessage', {
          receiver: login,
          content: inputValue,
        });
        setNewMsg((old) => [
          ...old,
          {
            content: inputValue,
            sendAt: new Date().toISOString(),
            loginSender: context.login,
            loginReceiver: login,
            fromUserA: true,
          },
        ]);
  
        // Check if the chat page is not active
       
      }
    }
  
    setInputValue('');
  };
  
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMsg();
  };


  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  
  const clickchoices = () => {
    
  };
  const btnBlock = () => {
    // to block
  };
    
  const [inputValue, setInputValue] = useState("");
  const [info, setInfo] = useState('hidden');
  const clickChoices = () => {
    if (info === 'hidden')
      setInfo('block');
    else
      setInfo('hidden');
  };

// ...



// ...

useEffect(() => {
  const chatContainer = chatContainerRef.current;
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}, [newMsg]);

// ...

// return (
//   <div ref={chatContainerRef} style={{ maxHeight: "400px", overflowY: "auto" }}>
//     {/* Chat history rendering */}
//   </div>
// )
const [hidden, setHidden] = useState('hidden');
const router = useRouter();

const clickPro = (): void => {
  if (hidden === 'hidden')
    setHidden('block');
  else
    setHidden('hidden');
}
const handleGameInvite = () => {
  if (context?.socket) {
    const url = `Game?room=${context.login}&queue=false`;
    console.log("emiting invite", url)
    context.socket.emit('gameInvitation', {
      receiver: login,
    });
    window.location.href = (`http://localhost:3000/${url}`)
    
  }
}


  return (

    <div className="flex flex-col h-full overflow-y-auto relative scrollbar scrollbar-thumb-green-400 scrollbar-w-1 scrollbar-track-slate-100 scrollbar- gap-1 bg-gray-300 rounded-2xl">
       {isModalOpen && <ModalInvite isOpen={isModalOpen} closeModal={closeModal} title="Invitation to Game" msg={`you've been invited to join a game against ${gameRoom}`} color={gameRoom}  />}
      <div className={`w-full h-[7%] flex chat chat-start  border-b-2 border-slate-500 items-center ${chatHistory.length === 0 ? "hidden" : ""}`}>
        <div className="w-1/2 pl-6">
          <AvatarOnline img={mhaddaou} />
        </div>
        <div className="w-1/2 pr-6 text-end">
          <div className="dropdown dropdown-left">
            <button onClick={clickPro}>
              <FontAwesomeIcon className="w-8 h-7 text-black" icon={faBars} flip />
              <ul className={`${hidden} bg-white absolute -left-24 z-20 rounded-lg y-2 text-sm text-gray-700 dark:text-gray-400 flex flex-col font-mono font-semibold`} aria-labelledby="dropdownLargeButton">
                <li>
                  <Link href="#" className=" hover:text-cyan-700 pl- text-left  rounded-t-lg block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">info</Link>
                </li>
                <li>
                  <Link href="#" className=" hover:text-cyan-700 text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">block</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-700 text-left rounded-b-lg block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</Link>
                </li>
                <li>
                  <Link href="#" onClick={handleGameInvite} className="hover:text-cyan-700 text-left rounded-b-lg block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Invite</Link>
                </li>

              </ul>
            </button>
            <div className={`${info} w-50 bg-gray-100 rounded-xl mt-20 z-50`}>
              <div className="m-4">
                <InfoContact />
              </div>
              <button onClick={btnBlock} className="btn flex text-center bg-transparent border-none hover:bg-slate-300 text-slate-600 m-4">block</button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[93%] flex flex-col p-2 " ref={chatContainerRef}>
      {
  (chatHistory.length > 0 ) &&
  newMsg.map((msg: MesgType) => {
    if (msg.loginSender === context?.login) {
      return <Sender  msg={msg.content} />;
    } else {
      return <Reciever  msg={msg.content} />;
    }
  })
}
  
        <div className={`mt-auto pb-1 pl-1 ${chatHistory.length === 0 ? "hidden" : ""}`}>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-grow p-2 rounded-lg mr-2 bg-bginp w-2 sm:w-full h-full focus:outline-none focus:border-2 focus:border-slate-500"
              />
              <button type="submit" onClick={sendMsg}><FiSend className="text-white w-5 h-5 mr-2" /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export {Reciever, Sender};