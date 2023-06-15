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

export default function Chat() {
  const context = useContext(MyContext);

  const [id, setId] = useState("");
  const [chatHistory, setChatHistory] = useState<MesgType[]>([]);
  const [show, setShow] = useState("block");

  async function handleContactClick(login: string) {
    setId(login);
    console.log("logina ", context?.login);
    console.log("loginb ", login);
    console.log("this is token", context?.token);
    const res = await axios.post(
      "http://localhost:5000/chat/findConversation",
      { loginA: context?.login, loginB: login },
      {
        headers: {
          Authorization: `Bearer ${context?.token}`,
        },
      }
    );
    context?.setMessageInfo(res.data[0]);
    context?.setMessageContent(res.data[1]);
    setChatHistory(res.data[1]);
    setShow("hidden");
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
      <div className="container w-full mx-auto h-screen min-h-[1024px] flex flex-row py-2 gap-2">
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
              <ChatHistory chatHistory={chatHistory} login={id} />
            </div>
          </div>
        </div>
      </div>
      <RealFooter />
    </div>
  );
}
