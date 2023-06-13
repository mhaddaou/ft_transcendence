import { useEffect, useState } from "react";
// import ChatApp from "../ChatApp";

import ChatHistory from '@/components/ChatHistory';

import Link from "next/link";
import ContactList from '@/components/ContactList';
import axios from 'axios';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RealFooter from "@/components/RealFooter";
import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";
import { MyContext } from "@/components/Context";
import { useContext } from "react";
import { headers } from "next/dist/client/components/headers";
import { MesgType } from "@/components/Context";


import { msgPropType } from "@/components/Context";
import {io} from "socket.io-client"

export default function Chat() {
  const context = useContext(MyContext);

  const [id, setId] = useState('');
  const [chatHistory, setChatHistory] = useState<MesgType[]>([]);
  const [show, setShow] = useState('block');

  async function handleContactClick(login : string) {
    setId(login);
    console.log("logina " ,context?.login)
    console.log("loginb " ,login);
    console.log("this is token", context?.token);
    const res = await axios.post('http://localhost:5000/chat/findConversation', 
          {loginA : context?.login, 
            loginB : login},
          {
          headers: {
            Authorization: `Bearer ${context?.token}`,
          },
        });
        // context?.(message);
        // console.log(res.data);
        context?.setMessageInfo(res.data[0]);
        context?.setMessageContent(res.data[1]);
        // console.log(context?.MessageContent);
        setChatHistory(res.data[1]);
        setShow('hidden');
  }

  // loginA 
  //loginB
  // username
  // 
  
  useEffect(() => {
    if (context?.token){
        var socket = io("http://localhost:3333", {
          extraHeaders: {
              Authorization: context?.token,
      }
      });
      socket.on('message', (payload: any) => {
        console.log("111111111111111");
        console.log(`Received message: ${payload}`);
        // SetToMessages(payload);
        // setMessages([...messages, payload]);
      });
      socket.on('errorMessage', (payload: any) => {
        console.log("111111111111111");

        console.log(`Received message: ${payload}`);
        // SetToMessages(payload);
        // setMessages([...messages, payload]);
      });
      context.setSocket(socket);

    }
  }, [context?.token]);

  
    
  return (
    <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
      <div className="container w-full mx-auto h-screen min-h-[1024px] flex flex-row py-2 gap-2">
        <Barl page="Chat"/>
        <div className="w-full h-full rounded-2xl flex flex-col  gap-2 ">
        <NavBar page="Chat"/>
        <div className="w-full h-[95%] rounded-2xl bg-gray-400 flex gap-1">
          <div className={`w-full md:w-[25%]  rounded-2xl bg-gray-200 ${show} md:block`}>
            <ContactList onContactClick={handleContactClick} />
          </div>
          <div className={`  md:block w-full md:w-[75%]  h-full rounded-xl ${show === 'hidden' ? 'block' : 'hidden'}`}>
            <ChatHistory chatHistory={chatHistory} login={id} />
          </div>
        </div>
        </div>
      </div>
      <RealFooter />
    </div>


  );
}

