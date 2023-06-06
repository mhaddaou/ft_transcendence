import { useState } from "react";
// import ChatApp from "../ChatApp";

import ChatHistory from '@/components/ChatHistory';

import Link from "next/link";
import ContactList from '@/components/ContactList';
import axios from 'axios';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";

export default function Chat() {
  const [id, setId] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);

  async function handleContactClick(contactId : any) {
    setId(contactId);
    const res = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${contactId}`);
        setChatHistory(res.data);
  }

  
    
  return (
    <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
      <div className="container w-full mx-auto h-screen min-h-[1024px] flex flex-row py-2 gap-2">
        <Barl page="Chat"/>
        <div className="w-full h-full rounded-2xl flex flex-col  gap-2 ">
        <NavBar page="Chat"/>
        <div className="w-full h-[95%] rounded-2xl bg-gray-400 flex gap-1">
          <div className="w-[25%]  rounded-2xl bg-gray-200">
            <ContactList onContactClick={handleContactClick} />
          </div>
          <div className="w-[75%]  h-full rounded-xl">
            <ChatHistory chatHistory={chatHistory} id = {id} />
          </div>


        </div>
        </div>
      </div>
    </div>


  );
}

{/* <div className="flex flex-row h-screen gap-1 my-2 mx-5 ">
  <div className="w-1/4  p-4  rounded-xl">
    <ContactList onContactClick={handleContactClick} />
  </div>
  <div className="w-1/2 p-4 h-full rounded-xl">
    <ChatHistory chatHistory={chatHistory} id = {id} />
  </div>
  <div className="w-1/4  p-4 rounded-xl">info Field</div>
</div> */}