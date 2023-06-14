
import { useState ,useEffect, useContext  } from "react";
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
// import ContactSearch from "./ContactSearch";
import InfoContact from "./InfoContact";
import { MesgType, MyContext } from "./Context";
import { msgPropType } from "./Context";
import { element } from "prop-types";

const Sender = ({msg} : {msg : string}) =>{
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
}
const Reciever = ({msg} : {msg : string}) =>{
  return (
    <div className="chat chat-start ">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image src={mhaddaou} alt="av" />
        </div>
      </div>
      <div className="chat-bubble bg-slate-400 ">{msg}</div>
    </div>

  );
}

const AvatarOffline = ({img} : {img : StaticImageData}) =>{
  return (
    <div className="avatar offline">
      <div className="w-14 rounded-full">
        <Image src={img} alt="avatar" />
      </div>
    </div>

  );
}

const AvatarOnline = ({img } : {img : StaticImageData}) =>{
  return (
    <div className="avatar online">
      <div className="w-14 rounded-full">
        <Image src={img} alt="avatar" />
      </div>
    </div>

  );
}




export default function ChatHistory({ chatHistory, login } :  {chatHistory : MesgType[], login: string}) {

  const context = useContext(MyContext);
  const [newMsg, setNewMsg] = useState<MesgType[] >([])



  
 
  
 
  
  

  

  
  
  const [newMessage, setNewMessage] = useState("");
  
  
  const [inputValue, setInputValue] = useState("");
  const SetToMessages = (payload : MesgType) =>{
    context?.setMessageContent([...context.MessageContent, payload]);
    // console.log("setMessageContent" ,payload);
    setNewMsg([...newMsg, payload]);
    console.log("setNewMsg" ,newMsg);

    
  } 
  useEffect(() => {
    if (!context?.socket){
      if (context?.token ){

        var socket = io("http://localhost:3333", {
              extraHeaders: {
                  Authorization: context?.token,
          }
          });
          socket.on('message', (payload: any) => {
              console.log("111111111111111666");
              console.log(`Received message: ${payload}`);
              // SetToMessages(payload);
              // setMessages([...messages, payload]);
            });
            
            socket.on('errorMessage', (payload : any) =>{
              console.log("error message: ", payload);
      
            })
            socket.on('PrivateMessage', (payload: any) => {
              if (payload)
                console.log("ren m ren ", payload);
            });
            
            context.setSocket(socket);
      }
    }
    else{
      context.socket.on('message', (payload: any) => {
        console.log("111111111111111");
        console.log(`Received message: ${payload}`);
        // SetToMessages(payload);
        // setMessages([...messages, payload]);
      });
      context.socket.on('errorMessage', (payload: any) => {
        console.log("111111111111111");

        console.log(`Received message: ${payload}`);
        // SetToMessages(payload);
        // setMessages([...messages, payload]);
      });
      context.socket.on('errorMessage', (payload : any) =>{
        console.log("error message: ", payload);

      })
      context.socket.on('PrivateMessage', (payload: any) => {
        if (payload)
          console.log("ren m ren ", payload);
      });
      context.socket.on('message', (payload: any) => {
        console.log("message: ren m ren   ", payload.data);
      })
    }
    }, [context?.token]);


      const sendMsg = () =>{
        console.log(`msg to send : ${inputValue}`);
        console.log('this is the user', login);
          if (context?.socket){
            context.socket.emit('PrivateMessage', {
              receiver : login,
              content : inputValue,
            })
            // savethemsg(login, inputValue);
            
            
          
          } 
        }
        



      
      const handleInputChange = (event : any) => {
        console.log("handel input change");
        setInputValue(event.target.value);
      };
      
      const handleSubmit = (event : any) => {
    event.preventDefault();
    if (inputValue.trim() !== "") {
      
      setInputValue("");
    }
  };
  
 
  
  
  
  // sender right
  const [ls, setls] = (useState('hidden'));
  
  
  const clickinfo = () =>{
    setls('block');
    
  }
  const [info, setinfo] = (useState('hidden'));
  const clickchoices = () =>{
    if (info === 'hidden')
    setinfo('block')
    else
    setinfo('hidden');
  }
  
  const btnBlock = () =>{
    //block friend
  }
  
  
  // interface ChatType{
  //   content : string,
  //   fromUserA : boolean,
  //   sendAt: string,
  // }
  
  return (
    <div className="flex flex-col h-full overflow-y-auto relative scrollbar scrollbar-thumb-green-400 scrollbar-w-1 scrollbar-track-slate-100 scrollbar- gap-1 bg-gray-300 rounded-2xl">
      <Lottie className={`w-[100%] h-[100%]   ${chatHistory.length == 0 ? "block" : "hidden"} `}   animationData={anim} />
      <div className={`w-full h-[7%] flex chat chat-start  border-b-2 border-slate-500  items-center  ${chatHistory.length == 0 ? "hidden" : "no"}`}>
        <div className="w-1/2 pl-6 ">
            <AvatarOnline img={mhaddaou} />
       </div>
        <div className="w-1/2 pr-6 text-end">
              <div className="dropdown dropdown-left flex flex-row-reverse gap-2">
                <button onClick={clickchoices}>
                  <FontAwesomeIcon className="w-8 h-7 text-black" icon={faBars} flip />
                </button>
                <div className={`${info} w-50 bg-gray-100 rounded-xl mt-20 z-50`}>
                <div className="m-4 "><InfoContact /> </div>
                <button onClick={btnBlock} className="btn flex text-center bg-transparent border-none hover:bg-slate-300 text-slate-600   m-4">block </button>

                </div>
       
      </div>
        </div>
      </div>
      <div className="w-full h-[93%] flex flex-col p-2  ">
      {

  (() => {
    const elements: JSX.Element[] = [];
    chatHistory.map((msg : MesgType ) => {
          if (context){
            if (context.MessageInfo)
            if (context?.MessageInfo.loginA === context?.login) {
              if (msg.fromUserA) {
                elements.push(<Sender msg={msg.content} />);
              } else {
                elements.push(<Reciever msg={msg.content} />);
              }
            } else {
              if (msg.fromUserA) {
                elements.push(<Reciever msg={msg.content} />);
              } else {
                elements.push(<Sender msg={msg.content} />);
              }
            }

          }
        });
    return elements;
  })()
}

  


        
                 
      
              <div className={`mt-auto pb-1 pl-1  ${chatHistory.length == 0 ? "hidden" : "no"} `}>
              <form onSubmit={handleSubmit}>
              <div className="flex items-center ">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-grow p-2 rounded-lg mr-2 bg-bginp w-2 sm:w-full h-full focus:outline-none focus:border-2 focus:border-slate-500"
                />
                <button type="submit" onClick={sendMsg}><FiSend className=" text-white w-5 h-5 mr-2 " /></button>
            
            </div>
          </form>
            </div>

      </div>
      
       
      
    </div>
    
  );
};
