
import { useState ,useEffect  } from "react";
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
const socket = io("http://localhost:3333");

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



export default function ChatHistory({ chatHistory, id } : any) {
  const myMap = new Map();
  myMap.set('key1', 'value1');
  myMap.set('key2', 'value2');
  
  console.log(myMap.get('key1'));


 
  
    
 
  

  const SetToMessages = (payload : any) =>{
    setMessages([...messages, {"postId": 4,
    "id": 16,
    "name": "perferendis temporibus delectus optio ea eum ratione dolorum",
    "email": "Christine@ayana.info",
    "body": payload}]);
  } 
  socket.on('receivedMessage', (payload: any) => {
    console.log(`Received message: ${payload}`);
    SetToMessages(payload);
    // setMessages([...messages, payload]);
  });
  
  
  const [messages, setMessages] = useState(chatHistory);
  // useEffect(() => {
  //   async function getData() {
  //     const response = await fetchData(props.url);
  //     setMessages(response);
  //   }
  //   getData();
  // }, []);

  const [newMessage, setNewMessage] = useState("");

  
  const [inputValue, setInputValue] = useState("");

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
  const mes = {
    sender: {id: 1, name: "john"},
    receiver:{id: 2, name: "jane"},
    content: inputValue
  };
  const click = ()=>{
    console.log("this is click");
    console.log("this is click");
    socket.on("connect", () => {
      console.log("Connected to server!");
    });
      
    socket.emit("sendMessage",mes)
  }



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
          chatHistory.map((chat : any) =>{
            if (chat.id % 2 == 0)
              return (<Sender msg={chat.name.toString()} />);
            else
              return (<Reciever msg={chat.name.toString()} />);
          })
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
                <button type="submit" onClick={click}><FiSend className=" text-white w-5 h-5 mr-2 " /></button>
            
            </div>
          </form>
            </div>

      </div>
      
       
      
    </div>
    
  );
};
