/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ChatHistory from "@/components/ChatHistory";
import Link from "next/link";
import ContactList from "@/components/ContactList";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RealFooter from "@/components/RealFooter";
import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";
import { MyContext } from "@/components/Context";
import { useContext } from "react";
import { MesgType } from "@/components/Context";
import { msgPropType } from "@/components/Context";
import { io } from "socket.io-client";
import createSocketConnection from "@/components/socketConnection";
import { useRouter } from "next/router";
import ChannelHistor from "@/components/ChannelHistory";
import History from "@/components/HIstory";
import { ModalInvite, ModalError } from "@/components/Modal";


export default function Chat() {
  const context = useContext(MyContext);

  const [check, setCheck] = useState('');
  const [id, setId] = useState("");
  const [chatHistory, setChatHistory] = useState<MesgType[] | any>([]);
  const [show, setShow] = useState("block");
  const [gameRoom, setGameRoom] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(()=>{
    if (context?.socket){

      context.socket.on('gameInvitation', (payload: any) => {
        
        console.log("game invite response ")
        if (payload && payload.sender) {
          setGameRoom(payload.sender)
          setIsModalOpen(true)
          
        }
        console.log(payload)
      });
    }
    })
    const closeModal = () => {
      setIsModalOpen(false);
    };
  async function handleContactClick(login: string, Channel: boolean) {
    

    if (Channel){

      const res = await axios.post(
        'http://localhost:5000/chat/channel/message/all',
        {channelName: login}, 
        {
          headers:{
            Authorization : `Bearer ${context?.token}`,
          },
        }
      );
      const response = await axios.post('http://localhost:5000/chat/channel/members', {
        channelName : login,
      },{
        headers:{
          Authorization: `Bearer ${context?.token}`,
        }
      })
      context?.setMembersChannel(response.data);
      console.log("onclik channel this is response ", context?.membersChannel);

      setCheck('channel');
      setId(login);
      context?.setChannelInfo(res.data[0]);
      setChatHistory(res.data[1]);
      console.log(context?.channelInfo , '  this is info')
    }
    else {
      console.log("inside users");

       const res = await axios.post(
        "http://localhost:5000/chat/findConversation",
        { loginA: context?.login, loginB: login },
        {
          headers: {
            Authorization: `Bearer ${context?.token}`,
          },
        }
      );
      setCheck('chat');
      setChatHistory(res.data[1]);
      context?.setMessageInfo(res.data[0]);
      context?.setMessageContent(res.data[1]);
      setId(login);

      // setShow("hidden");
    }
  }

  useEffect(() => {
    context?.setSocket(createSocketConnection(context?.token));
  }, [context?.token]);

  if (context?.socket)
    context?.socket.on("message", (paylo) => {
      console.log(paylo);
    });

  return (
    <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
      <ModalError />
       {isModalOpen && <ModalInvite isOpen={isModalOpen} closeModal={closeModal} title="Invitation to Game" msg={`you've been invited to join a game against ${gameRoom}`} color={gameRoom}  />}
       
      <div className="container w-full mx-auto h-screen min-h-[1024px] flex flex-row py-2 gap-2 z-30">
        <Barl page="Chat" />
        <div className="w-full h-full rounded-2xl flex flex-col  gap-2 ">
          <NavBar page="Chat" />
          <div className="w-full h-[95%] rounded-2xl bg-gray-400 flex gap-1">
            <div
              className={`w-full md:w-[25%]  rounded-2xl bg-gray-200 ${
                show
              } md:block`}
            >
              <ContactList onContactClick={handleContactClick} />
            </div>
            <div
              className={`md:block w-full md:w-[75%] h-full rounded-xl ${
                show === "hidden" ? "block" : "hidden"
              }`}
            >
              <History history={chatHistory} check={check} id={id} />

              
            </div>
          </div>
        </div>
      </div>
      <RealFooter />
    </div>
  );
}
