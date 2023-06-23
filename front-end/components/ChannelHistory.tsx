import { faBars, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiSend } from "react-icons/fi";
import defaul from '../image/avatar.webp'
import Image from "next/image";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { FriendType, MyContext } from "./Context";
// import { Reciever, Sender } from "./ChatHistory";
import { ModalUpdateChannel } from "./Modal";
import { Contrail_One } from "next/font/google";
import History from "./HIstory";
import Router from "next/router";
import { useRouter } from "next/router";
import axios from "axios";
import { Socket } from "socket.io-client";

interface recvProps{
  msg : string;
  time : string;
  avatar : string;
  name : string;
}

function GetAvatar ({avatar } : {avatar : string}) {
  if (avatar === '0')
    return (
      <Image src={defaul} alt="ava" />
    );
  else
      return (
        <img src={avatar} alt="ava"/>
      );

}

const Reciever = (props : recvProps) =>{
  return (
    <div className="chat chat-start">
    <div className="chat-image avatar">
      <div className="w-10 rounded-full">
        <GetAvatar avatar={props.avatar} />
      </div>
    </div>
    <div className="chat-header ">
      {props.name}
      <time className="text-xs opacity-50 pl-1">
                  {props.time.slice(11,16)} 
        </time>
    </div>
    <div className="chat-bubble">{props.msg}</div>
    
  </div>
  );
}

const Sender = (props : recvProps) =>{
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
        <GetAvatar avatar={props.avatar} />
        </div>
      </div>
      <div className="chat-header">
      {props.name}
        <time className="text-xs opacity-50 pl-1">
          {props.time.slice(11,16)}  
          </time>
      </div>
      <div className="chat-bubble">{props.msg}</div>
     
    </div>
  );

}


// file when store img
// const [file, setFile] = useState<File | null>(null)




// to change avatar of channel
const click = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const form = new FormData();
      form.append('file', file);
      axios
        .post('https://api.cloudinary.com/v1_1/daczu80rh/upload', form)
        .then((result) => {
          console.log(result.data.secure_url);
        });
    }
  });

  // Hide the file input element
  fileInput.style.display = 'none';

  // Append the file input element to the document
  document.body.appendChild(fileInput);

  // Programmatically trigger the file selection dialog
  fileInput.click();
};


export interface msgChannel{
  MsgChannelId: string;
  avatar : string;
  channelId: string;
  channelName : string;
  content : string;
  login : string;
  sendAt : string;
  username: string;
}
function GetAvatarAddFriend ({avatar } : {avatar : string}) {
  if (avatar === '0')
    return (
      <Image className="w-10 h-10 rounded-full border-4 border-green-600" src={defaul} alt="ava" />
    );
  else
      return (
        <img className="w-10 h-10 rounded-full border-4 border-green-600" src={avatar} alt="ava"/>
      );

}


/// to add members to channel
const AddMember = () =>{
  const context = useContext(MyContext)
  console.log(context?.friends);
  const [hidden, setHidden] = useState('hidden')
  const openModal = () =>{
    setHidden('block');
  }
  const closeModal = () =>{
    setHidden('hidden');
  }
  const Modal = () =>{
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${hidden}`}>
        <div className="bg-white w-60 h-60 z-50">
          <div>this is modal</div>
          <button onClick={() =>closeModal()}>close</button>

        </div>
      </div>
    );
  }
  const AddFriend = (friend : FriendType) =>{
    console.log(context?.channelInfo?.channelName)
    context?.socket?.emit('inviteMember',{channelName: context.channelInfo?.channelName, login : friend.login})
    console.log('context memebers ', context?.membersChannel);
    console.log(friend.login);
    openModal();

  }
    return(
      <>
          <Modal />
        <div className="dropdown dropdown-bottom dropdown-end z-40 ">
            <FontAwesomeIcon tabIndex={0} icon={faUserPlus}  className="text-slate-600 w-7 h-6 cursor-pointer hover:text-blue-900" /> 
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          {
            context?.friends && context?.friends.length > 0 ? context?.friends.map((friend) =>{
              return (
                  <li><button onClick={() =>AddFriend(friend)} className="flex">
                    <GetAvatarAddFriend avatar={friend.avatar} />
                      <p>{friend.username}</p>
                      </button></li>

              );
            }) : "don't have any friend to add it"
          }
              
        </ul>
        </div>
      </>
    );

}


interface TypeModal{
  isOpenModal : boolean;
  CloseModal : () => void; 
}


// udate channle or delete it
const clickInfo = () =>{}
const ChannelHistor = ({history, id} : {history : msgChannel[], id : string}) =>{




  const context = useContext(MyContext);
  
  
  const [msg, setMsg]= useState<msgChannel[]>([]);

  useEffect(() => {
    setMsg(history);
  }, [history]);

  useEffect(() => {
    if (context?.socket) {
      
      context.socket.on(`${context.channelInfo?.channelName}`, (payload: any) => {
        if (payload) {
          console.log('name of channel that listener ', context.channelInfo?.channelName);
          console.log( 'this is all ' , payload);
          console.log('this is msg ' , payload.content);
          setMsg((prevMsgs) => [...prevMsgs, payload]);
        }
        if (!document.hidden) {
          // Show a notification
          console.log('newMsg')
        }
        else
          console.log("msg and not in this page");
      });
    }
  
    return () => {
      if (context?.socket) {
        context.socket.off(`${context.channelInfo?.channelName}`);
      }
    };
  }, [context?.channelInfo?.channelName]);
  
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
    const openMd = () =>{
      setOpenModal(true);
    }
    const closeMd = () =>{
      setOpenModal(false);
    }
  const [inputValue, setInputValue] = useState('');
  
  const [isOpenModal, setIsopenModal] = useState(false);

    useEffect(() =>{
      if (context?.socket){
        context?.socket.on('message', (pay) =>{
          if (pay)
            console.log(pay);
        })
        context.socket.on('errorMessage' , (pay) =>{
          if (pay)
            console.log(pay);
        })
      }
    },[context?.socket])

    const removeChannelByName = (channelName: string) => {
      context?.setChannels(prevChannels =>
        prevChannels.filter(channel => channel.channelName !== channelName)
      );
    };
    

  const leaveChannel = () =>{
    context?.socket?.emit('leaveChannel', {
      channelName : context.channelInfo?.channelName,
    })
    if (context?.channelInfo)
    removeChannelByName(context?.channelInfo?.channelName);
    router.reload();

  }
  
  // for check when use delete  or leave channel 
  const [isOpenMember, setIsOpenMember] = useState(false);
  const closeMember = () =>{
    setIsOpenMember(false);
  }
  const openMember = () =>{
    setIsOpenMember(true);
  }
  const [valueCheck, setValueCheck] = useState(false);
  //delete Channel
  const deleteChannel = () =>{
    context?.socket?.emit('deleteChannel', {
      channelName : context.channelInfo?.channelName
    })
    if (context?.channelInfo)
    removeChannelByName(context?.channelInfo?.channelName)
    router.reload();
    // router.push(useRouter.pathname());

  }

  const memberChannel = () =>{
    const GetDat = async () =>{
      try{
        const res = await axios.post('http://localhost:5000/chat/channel/members',
        {channelName : context?.channelInfo?.channelName},
        {
          headers:{
            Authorization : `Bearer ${context?.token}`,
          }
        }
        )
        // console.log(res.data);
        context?.setMembersChannel(res.data);

      }catch(e){
        console.log(e);
      }
    }
    GetDat();
    console.log(context?.channelInfo);
    console.log('conte ', context?.membersChannel);
    setIsOpenMember(true);
  }

  interface propMember{
    isOpen : boolean;
    closeMember : () => void;
  }

  const ModalMembers = (props : propMember) =>{
    if (!props.isOpen)
      return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ">

        <div className={`bg-white p-6 rounded-md w-[400px] h-[600px] min-w-[400px] min-h-[600px]  flex flex-col gap-1 overflow-y-auto `}>
          <div className="w-full h-[90%]">
            nice

          </div>
          <div className="w-full h-[10%]">

            <button onClick={props.closeMember}>close</button>
          </div>

        </div>
        </div>
    )
  }
  
  //info
  const Info = () =>{

      return (
          <div className="dropdown dropdown-bottom dropdown-end">
              <FontAwesomeIcon tabIndex={0} className="w-7 h-6 text-slate-700 hover:text-blue-900 cursor-pointer" onClick={clickInfo} icon={faBars} flip />
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><button onClick={openMd}>Update Channel</button></li>
              <li><button onClick={memberChannel}>Members Channel</button></li>
              <li><button onClick={leaveChannel}>Leave Channel</button></li>
              <li><button onClick={deleteChannel}>Delete Channel</button></li>
          </ul>
          </div>
      );
  }
    const CloseModal = () =>{
        setIsopenModal(false);
    }
    const OpenModal = () =>{
        setIsopenModal(true);
    }

    //send message channel

    const send= () =>{
      console.log('send message on this channel  ', context?.channelInfo?.channelName);
      if (inputValue != ''){
        context?.socket?.emit('msgChannel', {
          channelName: context.channelInfo?.channelName, 
          content : inputValue,
        })
        setInputValue('');
      }
      // if (context?.socket)
      // context?.socket.on(`${context.channelInfo?.channelName}` , (pay) =>{
      //   console.log('ret '  , pay);
      //   setMsg((prevMsgs) => [...prevMsgs, pay]);
      //   context?.socket?.off(`${context.channelInfo?.channelName}`)
      // })
      // return () => {
      //       if (context?.socket) {
      //         context.socket.off(`${context.channelInfo?.channelName}`);
      //       }
      //     };
    }
   
    
    //  handle submit 

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
      event.preventDefault();
      send();
    }

    // handle any changes events
    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
      setInputValue(e.target.value);

    }
    

    return (
        
       <div className={`${valueCheck === true ? 'hidden' : 'flex'}flex-col h-full overflow-y-auto relative scrollbar scrollbar-thumb-green-400 scrollbar-w-1
        scrollbar-track-slate-100 scrollbar- gap-1 bg-gray-300 rounded-2xl `}>
        {
          openModal && <ModalUpdateChannel isOpen={openModal} closeModal={closeMd}/>
        }
        <ModalMembers isOpen={isOpenMember} closeMember={closeMember} />
      <div className={`w-full h-[7%]  flex chat chat-start  border-b-2 border-slate-500 items-center justify-between px-4  `}>
        <div>
        <div >
            
            <Image  className="w-12 h-12 rounded-full border-4 border-slate-400 cursor-pointer hover:border-slate-900" onClick={click}  src={defaul} alt="avatar" />
        </div>

        </div>
        <div className="flex items-center gap-10" >
        <AddMember />   
        <Info />
        </div>
       
      </div>
      <div className="w-full h-[93%] flex flex-col p-2 " >
      {msg.map((msg : msgChannel) =>{
        if (msg.login === context?.login)
          return <Sender msg={msg.content} time={msg.sendAt} avatar={msg.avatar} name={msg.username} />
        else
          return <Reciever msg={msg.content} time={msg.sendAt} avatar={msg.avatar} name={msg.username} />
      })}
      

  
        <div className={`mt-auto pb-1 pl-1 `}>
          <form 
          onSubmit={handleSubmit}
          >
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-grow p-2 rounded-lg mr-2 bg-bginp w-2 sm:w-full h-full focus:outline-none focus:border-2 focus:border-slate-500"
              />
              <button onClick={send} type="submit" ><FiSend className="text-white w-5 h-5 mr-2" /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
}


export default ChannelHistor;