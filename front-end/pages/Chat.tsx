/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ChatHistory from "@/components/ChatHistory";
import Link from "next/link";
import ContactList from "@/components/ContactList";
import axios from "axios";
import Footer from "@/components/Footer";
import RealFooter from "@/components/RealFooter";
import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";
import Router from "next/router";
import { MyContext } from "@/components/Context";
import { useContext } from "react";
import { MesgType } from "@/components/Context";
import { msgPropType } from "@/components/Context";
import { io } from "socket.io-client";
import createSocketConnection from "@/components/socketConnection";
import { useRouter } from "next/router";
import ChannelHistor from "@/components/ChannelHistory";
import History from "@/components/HIstory";
import { ModalGameInvite, ModalError } from "@/components/Modal";
import { constrainedMemory } from "process";
import { connect } from "http2";
const router = Router;
var token : string | null = null;


export default function Chat() {
  const context = useContext(MyContext);

  const [check, setCheck] = useState('');
  const [login , setLogin ] = useState('');

  

  const [id, setId] = useState("");
  const [chatHistory, setChatHistory] = useState<MesgType[] | any>([]);
  const [show, setShow] = useState("block");
  const [gameRoom, setGameRoom] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() =>{
    token = localStorage.getItem('token');
    token ? router.push('/Chat') : router.push('/');
  },[])
  useEffect(()=>{
    if (context?.socket){
      context?.socket?.on('channelRemoved', (pay) =>{

        if (pay){
          if (pay.channelName == context.channelInfo?.channelName)
            context.setShowChannel(false);
          const fetchData = async () => {
            try {
              const res = await axios.post(
                `${process.env.Memb}`,
                { login: context?.login },
                {
                  headers: {
                    Authorization: `Bearer ${context?.token}`,
                  },
                }
              );
              // context?.setContactChat(res.data);
              context?.setChannels(res.data);
      
            } catch (error) {
            }
          };
        
          fetchData();
  
        }
      })
      
      context.socket.on('gameInvitation', (payload: any) => {
          
       
        if (payload && payload.sender) {
          context.setGameInvitation(true)
          context.setGameHost(payload.sender)
        }
      });
      return () =>{
        if (context?.socket){
          context.socket.off('gameInvitation')
        }
      }
    }
    })
    const closeModal = () => {
      setIsModalOpen(false);
    };
  async function handleContactClick(login: string, Channel: boolean) {
      setLogin(login);
      context?.setNameDelete(login);
      context?.setLoginClick(login);
    if (Channel){
      context?.setShowChannel(true);

      const res = await axios.post(
        `${process.env.AllMes}`,
        {channelName: login}, 
        {
          headers:{
            Authorization : `Bearer ${context?.token}`,
          },
        }
      );
      const response = await axios.post(`${process.env.Banned}`, {
        channelName : login,
      },{
        headers:{
          Authorization: `Bearer ${context?.token}`,
        }
      })
      context?.setChannelBanner(response.data);
      // context?.setMembersChannel(response.data);
      const resp = await axios.post(`${process.env.Membership}`,
      {
        channelName : login,
      }, {
        headers:{
          Authorization: `Bearer ${context?.token}`
        }
      })
      context?.setAdminChannel(resp.data[0].admins);
      context?.setMembersChannel(resp.data[1].members);
      setCheck('channel');
      setId(login);
      context?.setChannelInfo(res.data[0]);
      setChatHistory(res.data[1]);
      context?.setChannelHistory(res.data[1]);
    }
    else {
    context?.setShowChat(true);
    localStorage.setItem('statee', login);
   
    
      try{
        const res = await axios.post(
         `${process.env.FindConversation}`,
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

      }catch(e){
      }
    }
    
  }

  useEffect(() =>{
    if (!context?.socket?.connected){
      context?.setSocket(createSocketConnection(context?.token))
    }
  },[context?.token])
if (token){
  return (
    <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
      <ModalError />
      <ModalGameInvite />       
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
}
