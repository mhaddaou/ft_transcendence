
import { useState ,useEffect  } from "react";
import { FiSend } from 'react-icons/fi';
import Avatar from "./Avatar";
import axios from "axios";
import { io } from "socket.io-client";
// import ContactSearch from "./ContactSearch";
const socket = io("http://localhost:4040");
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

  return (
    <div className="flex flex-col h-full overflow-y-auto relative scrollbar scrollbar-thumb-green-400 scrollbar-w-1 scrollbar-track-slate-100 scrollbar- ">
      <Avatar id={id} check={chatHistory.length == 0 ? "false" : "true"}/>
      {chatHistory.map((message : any) => (
       
        <div key={message.id} className={`mb-4 flex justify-${message.id %2 == 0  ? "end" : "start"}`}> 
        <div className={`${
              message.id % 2 == 0  ? "bg-blue-500 text-white" : "bg-blue-100"
            } py-2 px-4 rounded-lg`}>
          {message.body}</div></div>
         
      ))}
      {messages.map((message : any) => (<div key={message.id} className={`mb-4 flex justify-${message.id %2 == 0  ? "end" : "start"}`}> 
        <div className={`${
              message.id % 2 == 0  ? "bg-blue-500 text-white" : "bg-blue-100"
            } py-2 px-4 rounded-lg`}>
          {message.body}</div></div>
         
      ))}
       <div className={`mt-auto sticky bottom-0 ${chatHistory.length == 0 ? "hidden" : "no"} `}>
        <form onSubmit={handleSubmit}>
        <div className="flex items-center ">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-grow p-2 rounded-lg mr-2 bg-bginp w-2 sm:w-full h-full"
          />
          <button type="submit" onClick={click}><FiSend className=" text-white w-5 h-5 mr-2 " /></button>
       
      </div>
    </form>
      </div>
      
    </div>
    
  );
};
