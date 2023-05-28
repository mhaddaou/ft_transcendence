import { useState } from "react";
// import ChatApp from "../ChatApp";

import ChatHistory from '@/components/ChatHistory';

import Link from "next/link";
import ContactList from '@/components/ContactList';
import axios from 'axios';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Chat() {
  const [id, setId] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);

  async function handleContactClick(contactId : any) {
    setId(contactId);
    const res = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${contactId}`);
        setChatHistory(res.data);
  }

  
    
  return (
    <div className="bg-slate-800 h-full w-screen">
        <Header check={true} />
      <div className="flex flex-row h-screen gap-1 my-2 mx-5 ">
        <div className="w-1/4  p-4 bg-slate-900 rounded-xl">
          <ContactList onContactClick={handleContactClick} />
        </div>
        <div className="w-1/2 bg-slate-950 p-4 h-full rounded-xl">
          <ChatHistory chatHistory={chatHistory} id = {id} />
        </div>
        <div className="w-1/4 bg-slate-900 p-4 rounded-xl">info Field</div>
      </div>
      <Footer />
    </div>
  );
}
