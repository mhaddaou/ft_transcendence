import React, { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { InfoChannelProp, MyContext, channelSearchProps } from "./Context";
import { Star, AlertCircle } from 'react-feather'
import Avatar from '../image/avatar.jpg'
import Image, { StaticImageData } from "next/image";
import { FriendType } from "./Context";
import { userSearchProps, BanedType } from "./Context";
import Router from "next/router";
const router = Router

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  msg: string;
  color: string

}

interface ModalCheckProps {
  isOpen: boolean;
  closeModal: () => void;
  closeOldModal: () => void;
  title: string;
  msg: string;
  color: string

}

import { ReactNode } from 'react';
import axios from "axios";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { send } from "process";
import { Socket } from "socket.io-client";
import { checkIs7rag } from "./Functions";
import { RiCpuFill } from "react-icons/ri";



const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, title, msg, color }) => {
  const context = useContext(MyContext);
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`${color} p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-gray-700 mb-6">
          {msg}
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => {
              closeModal()
              context?.setChn(true);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const ModalCheckFalse: React.FC<ModalProps> = ({ isOpen, closeModal, title, msg, color }) => {
  const context = useContext(MyContext);
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`${color} p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-gray-700 mb-6">
          {msg}
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => {
              closeModal()
              context?.setChn(true);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalCheckTrue: React.FC<ModalCheckProps> = ({ isOpen, closeModal, closeOldModal, title, msg, color }) => {
  const context = useContext(MyContext);
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`${color} p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-gray-700 mb-6">
          {msg}
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => {
              closeModal()
              closeOldModal();
              context?.setChn(true);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


interface ModalChatProps {

  isOpen: boolean;
  closeModal: () => void;
  name: string;
  login: string;

}

const ModalChat: React.FC<ModalChatProps> = ({ isOpen, closeModal, name, login }) => {
  const context = useContext(MyContext);
  const value = useRef<HTMLTextAreaElement | null>(null);



  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }
  const sendMsg = () => {
    console.log('here when i send message')
    if (value.current) {
      if (context?.socket) {
        if (context?.token)
          checkIs7rag(context?.token);
        context.socket.emit('PrivateMessage', {
          receiver: login,
          content: value.current.value
        })
      }
      const fetchData = async () => {
        try {
          const res = await axios.post(
            `${process.env.Conversations}`,
            { login: context?.login },
            {
              headers: {
                Authorization: `Bearer ${context?.token}`,
              },
            }
          );
          context?.setContactChat(res.data);
  
        } catch (error) {
        }
      };
    
      fetchData();
      closeModal();
      
    }
  }

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-white p-6 rounded-md flex flex-col gap-3 `}>
        <h2 className="text-2xl font-bold mb-4 text-center">New message to @{name}</h2>
        <div className="w-full h-[70%] bg-blu-400 flex justify-center ">
          <textarea ref={value} className=" textarea textarea-ghost h-full w-full max-h-[250px] sm:max-h-[300px]" placeholder="Type a message..."></textarea>


        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Close
          </button>
          <button onClick={sendMsg} className="px-4 py-2 bg-blue-500 text-slate-100 rounded hover:bg-blue-800">send message</button>
        </div>
      </div>
    </div>
  );
};

interface ModalChannel {
  isOpen: boolean;
  closeModal: () => void;

}



const ModalUpdateChannel: React.FC<ModalChannel> = ({ isOpen, closeModal }) => {
  
  const context = useContext(MyContext);
  const [file , setFile] = useState<File | null>(null);
  const [checkPass, setCheckPass] = useState(context?.channelInfo?.ispassword);
  const [checkPrivate, setCheckPrivate] = useState(context?.channelInfo?.isPrivate);
  const [inputPass, setInputPass] = useState('');
  const [removePass, setRemovePass] = useState(false);
  const [url, setUrl] = useState('');
  const [openFalse, setOpenFalse] = useState(false);
  const [openTrue, setOpenTrue] = useState(false);
  const [msg, setMsg] = useState('');
  const [color, setColor] = useState('');
  const [title, setTitle] = useState('');
  
  const openModalFalse = () =>{
    setOpenFalse(true);
  }
  const closeModaleFalse = () =>{
    setOpenFalse(false);
  }
  const openModalTrue = () =>{
    setOpenTrue(true);
  }
  const closeModaleTrue = () =>{
    setOpenTrue(false);
  }

   
  


  const update  = () =>{
    if (!file )
      if (checkPass == context?.channelInfo?.ispassword)
        if (inputPass.length == 0)
          if (checkPrivate == context?.channelInfo?.isPrivate){
            setMsg('You are not change any things');
            setTitle('Warning !');
            setColor('bg-orange-400');
            openModalFalse();
            return

          }
    if (checkPass){
        
      if (!context?.channelInfo?.ispassword && !inputPass.length || !context?.channelInfo?.ispassword && inputPass.length < 8 || 
        (context?.channelInfo?.ispassword && checkPass && inputPass.length > 0 && inputPass.length < 8)
        ){

        setMsg('error password');
        setTitle('ERROR !');
        setColor('bg-orange-400');
        openModalFalse();
        return;
      }
    }
    if (file){
      const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", "mhaddaou");
        if ((file.type !== "image/jpeg") && (file.type !== "image/png")){
          setMsg('This image is not jpeg or PNG');
          setTitle('ERROR !');
          setColor('bg-orange-400');
          openModalFalse();
          return;
        }
        const sendImage = async () =>{
          try{
            const res = await axios.post(`${process.env.Clouad}`, form);
            if (res.data){
              if (context?.token)
                checkIs7rag(context?.token);
              context?.socket?.emit('updateChannel',
              {
                channelName : context.channelInfo?.channelName,
                isPrivate : checkPrivate,
                ispassword : checkPass,
                newPassword : inputPass,
                avatar : res.data.secure_url,
              })
              setInputPass('');
              setFile(null);
              setTitle('SUCCESS !');
              setMsg('avatar and new password and private is changed successfully')
              setColor('bg-green-400');
              openModalTrue();
            }
          }catch(e){}
      
              }
              sendImage();

    }
    else{
      if (context?.token)
        checkIs7rag(context?.token);
      context?.socket?.emit('updateChannel',
      {
        channelName : context.channelInfo?.channelName,
        isPrivate : checkPrivate,
        ispassword : checkPass,
        newPassword : inputPass,
      })
      setInputPass('');
      setFile(null);
      setTitle('SUCCESS !');
      setMsg(' All changed successfully')
      setColor('bg-green-400');
      openModalTrue();
    }
  }
  
  const handleChange = (e : ChangeEvent<HTMLInputElement>) =>{
    if (e.target.files )
    setFile(e.target.files[0]);
}
const handleInput = (e : ChangeEvent<HTMLInputElement>) =>{ 
  setInputPass(e.target.value)
}
  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <ModalCheckFalse isOpen={openFalse} closeModal={closeModaleFalse} title={title} color={color} msg={msg}  />
      <ModalCheckTrue isOpen={openTrue} closeModal={closeModaleTrue} closeOldModal={closeModal} title={title} color={color} msg={msg}  />
      <div className="w-[500px] h-[50%] bg-white rounded-lg">
        <div className="w-full h-full pt-2 flex flex-col gap-10 ">
          <div className="w-full h-[10%]   flex justify-center items-center text-base md:text-xl ">Update Channel {context?.channelInfo?.channelName}</div>
          <div className="w-full h-[80%] space-y-2 ">
          <div className="w-full h-1/3 flex justify-center items-center gap-4 flex-col">
            <div>
            <p className="text-xl font-mono font-semibold">change avatar</p>
            </div>
            <div className="pl-14">
            <input type="file" onChange={handleChange} className="file-input file-input-bordered file-input-sm w-full max-w-xs" />

            </div>
           
          </div>
          
          <div className="w-full h-1/3 flex   flex-col  ">
            <div  className="w-full h-1/2 flex justify-center gap-20">
              <div>
                <p className="text-xl font-mono font-semibold">change password</p>
              </div>
              <div>
              <input type="checkbox"  onClick={() => setCheckPass(!checkPass)} checked={checkPass}  className="checkbox" />
              </div>

            </div>
            <div className="w-full h-1/2">
              <div className="flex items-center justify-center">
              <input type="password" disabled = {!checkPass} onChange={handleInput} value={inputPass}  placeholder="password" className="input input-ghost w-full max-w-xs" />
              </div>
            </div>  
          
              
          </div>
          <div className="w-full h-1/3 flex justify-center items-center gap-20">
            <div className="text-xl font-mono font-semibold">
                Private Channel
            </div>
            <div>
            <input type="checkbox" onClick={() => setCheckPrivate(!checkPrivate)} checked={checkPrivate}  className="checkbox" />
            </div>
          </div>

          </div>
            <div className="w-full h-[10%]  text-xl  font-semibold flex justify-end px-8 gap-5 pb-2">
              <button className=" btn " onClick={closeModal}>Close</button><button className="btn" onClick={update}>Update</button>
            </div>
        </div>

      </div>


    </div>
  )
  
};

const ModalCreateChannel: React.FC<ModalChannel> = ({ isOpen, closeModal }) => {
  const passref = useRef<HTMLInputElement | null>(null);
  const chanref = useRef<HTMLInputElement | null>(null);
  const [msg, setMsg] = useState('');
  const [msgError, setMsgError] = useState('');
  const [color, setColor] = useState('');
  const [title, setTitle] = useState('');
  const context = useContext(MyContext);
  useEffect(() => {
    if (context?.socket)
      context?.socket.on('createChannel', (pay) => {
        setMsg(pay);
        setColor('bg-green-400');
        setTitle('Success');
        if (chanref.current) {
          const chann = {
            avatar: "0",
            channelName: chanref.current.value,
          }
          context.setChannels((old) => [...old, chann]);
        }
        openModal()
      })
    if (context?.socket)
      context?.socket.on('errorChannel', (pay) => {

        setMsg(pay.message);
        setColor('bg-orange-400');
        setTitle('Failed');
        openModal()
      })
    return () => {
      // context?.socket?.off('errorCreateChannel');
      context?.socket?.off('createChannel');
      context?.socket?.off('errorChannel');
    }

  }, [context?.socket])

  useEffect(() => {
    if (context?.chn)
      closeModal()
    context?.setChn(false);
  }, [context?.chn])

  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }


  interface newChannel {
    channelName: string;   // Required
    isPrivate: boolean;    // Required
    ispassword: boolean;   // Required
    password?: string;     // Optional
  }

  const [check, setCheck] = useState(false);
  const [pass, setPass] = useState(false);
  const clickPass = () => {
    setPass(!pass);
  }

  const clickcheck = () => {
    setCheck(!check);
  }
  const checkAllInput = () => {
    if (chanref.current && chanref.current.value.length < 4){
      context?.setMessageError('Name of the channel must be at least 4 characters')
      return false
    }
    if (pass && passref.current && passref.current.value.length < 8){
      context?.setMessageError('password must be at least 8 characters');
      return false
    }
    return true;
  }
 
  

  const Create = () => {
    if (!checkAllInput()){
      context?.setError(true);
      return null;
    }

   
    if (context?.token)
      checkIs7rag(context?.token);
    if (pass && check) {
      var msg: newChannel | string = '';
      if (chanref.current && passref.current) {
        msg = {
          channelName: chanref.current.value,
          isPrivate: check,
          ispassword: pass,
          password: passref.current.value,
        }
      }

      context?.socket?.emit('newChannel', msg)
      // closeModal()

    }
    
    else if (pass) {
      var msg: newChannel | string = '';

      if (chanref.current && passref.current) {
        msg = {
          channelName: chanref.current.value,
          isPrivate: check,
          ispassword: pass,
          password: passref.current.value,
        }
        if (context?.token)
          checkIs7rag(context?.token);
        context?.socket?.emit('newChannel', msg)
      }
      // closeModal()
      openModal();


    }
    else if (check) {
      var msg: newChannel | string = '';

      if (chanref.current) {
        const msg: newChannel = {
          channelName: chanref.current.value,
          isPrivate: check,
          ispassword: pass,
          password: '',
        }
        if (context?.token)
          checkIs7rag(context?.token);
        context?.socket?.emit('newChannel', msg)
      }
      // closeModal()

    }
    else {
      
      var msg: newChannel | string = '';
      
      if (chanref.current) {
        msg = {
          channelName: chanref.current.value,
          isPrivate: check,
          ispassword: pass,
          password: '',
        }
      }
      if (context?.token)
        checkIs7rag(context?.token);
      context?.socket?.emit('newChannel', msg)
    }

  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModale = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 ">
      {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModale} title={title} msg={msg} color={color} />}
      <div className={`bg-white p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-4">Create Channel</h2>
        <div className="bg-re mb-5 flex flex-col gap-2 pt-4">
          <div className="font-semibold font-mono">
            <p >name of channel</p>
            <input type="text" ref={chanref} placeholder="Name Channel" className="input input-bordered input-sm w-full max-w-xs" />
          </div>
          <div className="form-control font-semibold font-mono">
          <label htmlFor="checkbox" className="label cursor-pointer">
            <span className="label-text">Password</span>
            <input
              type="checkbox"
              id="password"
              onClick={clickPass}
              defaultChecked={pass}
              className="checkbox"
            />
          </label>

          </div>
          <input type="password" disabled = {!pass} ref={passref}  placeholder="Password" className="input input-bordered input-sm w-full max-w-xs" />



          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Private Channel</span>
              {/* <input type="checkbox" onClick={clickcheck} checked={check} className="checkbox" /> */}
              <input
                type="checkbox"
                onClick={clickcheck}         
                defaultChecked={check}
                className="checkbox"
              />
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={Create}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};


// const ModalUpdateCHannel = () =>{
//   reuturn l
// }



//  <div className="font-semibold font-mono">
//             <p>password</p>
//             <input type="text" placeholder="password" className="input input-bordered input-sm w-full max-w-xs" />
//           </div>


export interface dataProp {
  UserId: string;
  login: string,
  username: string;
  email: string,
  avatar: string;
  enableTwoFa: boolean,
  twoFactorSecret: string,
  bioGra: string,
  lvl: number
}

interface ModaleJoin {
  isOpen: boolean;
  closeModal: () => void;
  channel: channelSearchProps;
  closeModalSearch: () => void;
}

const ModalJoin = (props: ModaleJoin) => {
  if (!props.isOpen) {
    return null; // If isOpen is false, don't render the modal
  }
  const context = useContext(MyContext);
  const [hidden, setHidden] = useState('hidden');
  const [msg, setMsg] = useState('');
  const [color, setColor] = useState('')

  const value = useRef<HTMLInputElement | null>(null);
  const Res = () => {
    if (props.channel.ispassword) {
      setHidden('block')
      return (
        <div className="flex flex-col gap-2">
          <p>this channel with pass</p>
          <input type="password" placeholder="Type Password"  ref={value} className={`input input-bordered  w-full max-w-xs ${color} `} />
          <p>{msg}</p>

        </div>
      );
    }
    else {
      if (context?.token)
        checkIs7rag(context?.token);
      context?.socket?.emit('joinChannel', { channelName: props.channel.channelName })
      setHidden('hidden')
      return (
        <div>your are joined</div>
      );
    }
  }

  const JoinChannelPass = () => {
    if (context?.token)
      checkIs7rag(context?.token);
    if (value.current)
      context?.socket?.emit('joinChannel', { channelName: props.channel.channelName, password: value.current.value })



  }
  useEffect(() =>{
    if (context?.socket){
      context?.socket.on('errorJoin', (pay) =>{
        if (pay ){
          setMsg(pay.message);
          setColor('input-error')
        }
      })
      context.socket.on('join', (pay) =>{
        if (pay){
          const GetDat = async () =>{
            try{
              const res = await axios.post(
                `${process.env.AllMes}`,
                {channelName: props.channel.channelName}, 
                {
                  headers:{
                    Authorization : `Bearer ${context?.token}`,
                  },
                }
              );
            }catch(e){}
          }
          props.closeModal();
          props.closeModalSearch()
        }
      })

    }
    return () =>  {
        context?.socket?.off('join');
        // context?.socket?.off('errorJoin');
    };

  }, [context?.socket])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ">

      <div className={`bg-white p-6 rounded-md w-60 h-60  flex flex-col gap-1`}>
        <div className="w-full h-full">
          <div className="w-full h-[80%]">
            <Res />
          </div>
          <div className="w-full h-[10%] flex justify-end items-center gap-4">
            <button onClick={props.closeModal} className="bg-slate-400 px-2 py-1 rounded-xl border-2 border-slate-700 text-white font-semibold">close</button>
            <button className={`bg-blue-400 px-2 py-1 rounded-lg border-2 border-blue-800 text-white font-semibold ${hidden}`} onClick={JoinChannelPass}>join</button>

          </div>
        </div>

      </div>
    </div>

  );
}


interface ModalSearchProps {
  isOpen: boolean;
  closeModal: () => void;


}




const ModalSearch = (props: ModalSearchProps) => {
  const context = useContext(MyContext);

  const GetAvatar = ({ avat }: { avat: string | undefined }) => {
    if (avat === '0')
      return (
        <Image src={Avatar} alt="ava" />
      );
    else
      return (
        <img src={avat} alt="ava" />
      );
  }


  if (!props.isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  const removeChat = (login: string) => {
    if (context?.waitToAccept)
    context?.setWaitToAccept(prevcontact =>
      prevcontact.filter(chat => chat.login !== login))
  }


  const sendInvite = (user: userSearchProps) => {

    if (user.login) {
      if (context?.token)
        checkIs7rag(context?.token);
      context?.socket?.emit('inviteFriend', {
        login: user.login,
      })
      // if (user)

      const friend: FriendType = {
        login: user.login,
        username: user.username,
        avatar: user.avatar,
      }
      removeChat(user.login)
      if (context?.waitToAccept)
        context?.setWaitToAccept((prev) => [...prev, friend])
      else
        context?.setWaitToAccept([friend]);

      // when i add this
    }
    props.closeModal()
    context?.setChn(true);
  }


 
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalJoin, setOpenModalJoin] = useState(false);

  const openModaleJoin = () => {
    setOpenModalJoin(true);
  }
  const closeModalJoin = () => {
    setOpenModalJoin(false);
  }

  const sendMsg = (login: string, username: string,) => {

    setName(username);
    setLogin(login);
    setIsModalOpen(true);

  }
  const openModal = () => {
    setIsModalOpen(true);
  }
  const closeModal = () => {
    setIsModalOpen(false);
  }
  interface PropsClickJoin {
    channel: channelSearchProps;
    closeModal: () => void;
  }
  const [modalpass, setModalpass] = useState(false);
  const [channelClick, setChannelClick] = useState<channelSearchProps | null>(null);



  const ModalPass = () =>{
    const [pass, setPass] = useState("");

    const value = useRef();
    const clickJoin = () =>{
      if (context?.token)
        checkIs7rag(context?.token);
      context?.socket?.emit('joinChannel', { channelName: channelClick?.channelName, password: pass })
      props.closeModal();
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPass(event.target.value);
    };
   


    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ">
        <div className="w-[20%] h-[30%] rounded-2xl bg-white  ">
          <div className="w-full h-1/3 flex justify-center pt-4 text-xl font-semibold"> This channel with password</div>
          <div className="w-full h-1/3 flex justify-center"> 
          <form id="passchannel" onSubmit={handleSubmit}>
            <div className="flex items-center">
              <input
                type="password"
                value={pass}
                onChange={handleInputChange}
                placeholder="Type Password"
                className="input input-bordered input-md"
              />
            </div>
          </form>
          </div>
          <div className="w-full h-1/3 flex justify-end  items-end pb-3 pr-6 gap-6">
            <button className="bg-slate-500 px-3 py-1 rounded-lg text-white text-lg" onClick={() =>setModalpass(false)}>close</button>
            <button className="bg-slate-500 px-3 py-1 rounded-lg text-white text-lg" onClick={clickJoin} >join</button>
          </div>
        
        </div>
      </div>
    )
  } 
  const clickJoin = (channel: channelSearchProps) => {
    setChannelClick(channel);
    // setChannel(channel);
    // props.closeModal();
    // openModaleJoin();
    // context?.token?.emit('joinChannel', {})
    if (channel.ispassword){

      // props.closeModal();
      setModalpass(true);
    }
    else{
      props.closeModal();
      if (context?.token)
        checkIs7rag(context?.token);
      context?.socket?.emit('joinChannel', { channelName: channel.channelName })
    }
    
    

  }
  const [channel, setChannel] = useState<channelSearchProps>()
  const viewProfile = (user : FriendType) =>{

   context?.setProfileuser(user.login);
    const getData = async () => {
      try{
        const res = await axios.post(`${process.env.ViewProfile}`,
          { login: user.login },
          {
            headers: {
              Authorization: `Bearer ${context?.token} `
  
            }
          });
        if (res.data.message)
          router.push(`${process.env.Profile}/${user.login}`)
      }catch(e){}
    }
    getData();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ">
      <ModalChat isOpen={isModalOpen} closeModal={closeModal} name={name} login={login} />
      {channel && <ModalJoin isOpen={openModalJoin} closeModal={closeModalJoin} channel={channel} closeModalSearch={props.closeModal} />}
      {modalpass && <ModalPass />}


      <div className={`bg-white p-6 rounded-md w-[700px] h-[700px] flex flex-col gap-1`}>
        <div className="w-full h-[5%]">
          <h2 className="text-2xl font-bold mb-4 text-center">Search</h2>
        </div>
        {/* this for users */}
        <div className="w-full h-[45%]   flex-col">
          <div className="w-full h-[10%]">
            <h1 className="font-mono  font-semibold border-b-2">Users</h1>
          </div>
          <div className="w-full h-[90%] flex flex-col gap-1 overflow-y-auto">
            {
              context?.userSearch && context.userSearch.map((user: userSearchProps) => {
                return (
                  <div key={user.login} className="w-full min-h-[60px] bg-slate-100 flex items-center rounded-xl justify-around">
                    <div className="avatar">
                      <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <GetAvatar avat={user.avatar} />

                      </div>
                    </div>
                    <div>
                      <p className="font-bold">{user.username}</p>
                    </div>
                    <div className="dropdown dropdown-end">
                      <button tabIndex={0}><FontAwesomeIcon icon={faBars} /></button>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><button onClick={() => sendInvite(user)}>Add Friend</button></li>
                        <li><button onClick={() => sendMsg(user.login, user.username)}>Send Message</button></li>
                        <li><button onClick={() =>viewProfile(user)}>View Profile</button></li>
                      </ul>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
        {/* this for channels */}
        <div className="w-full h-[45%]   flex-col">
          <div className="w-full h-[10%]">
            <h1 className="font-mono  font-semibold border-b-2">Channels</h1>
          </div>
          <div className="w-full h-[90%] flex flex-col gap-1 overflow-y-auto">
            {
              context?.channelSearch && context.channelSearch.map((channel: channelSearchProps) => {
                return (
                  <div key={channel.channelName} className="w-full min-h-[60px] bg-slate-100 flex items-center rounded-xl justify-around">
                    <div className="avatar">
                      <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <GetAvatar avat={channel.avatar} />

                      </div>
                    </div>
                    <div>
                      <p className="font-bold">{channel.channelName}</p>
                    </div>
                    <button onClick={() => clickJoin(channel)} className={`hover:bg-blue-200 hover:text-black bg-slate-500 text-white px-3 py-1 rounded-2xl border-2 border-slate-300 `}>Join</button>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="w-full h-[5%] flex justify-end  items-center">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => {
              props.closeModal()
              context?.setChn(true);
            }}
          >
            Close
          </button>
        </div>





      </div>
    </div>
  );
};
const ModalGame: React.FC<ModalProps> = ({ isOpen, closeModal, title, msg, color }) => {
  const router = Router;

  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className=" absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-[#7e22ce] p-6 rounded-md`}>
        {
          title.length ? (

            <div className="flex justify-center gap-2">
              <Star fill="gold" color='gold' />
              <Star className="pt-1" fill="gold" color='gold' />
              <Star fill="gold" color='gold' />
            </div>
          ) : null
        }
        <h2 className="text-2xl text-white font-bold mt-6 text-center">{title}</h2>
        <h2 className={`text-2xl ${title.length ? `text-[#FFD700]` : `text-[#e9e8e2]`} font-bold mb-6 text-center`}>{msg}</h2>
        <div className="flex justify-end gap-2">
          {
            title.length ? (

              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={closeModal}
              >
                Replay
              </button>
            ) : null
          }
          <button onClick={()=>{router.push(`${process.env.Dashbord}`);}} className="px-4 py-2 bg-red-200 text-gray-700 rounded hover:bg-red-300">Leave</button>
        </div>
      </div>
    </div>
  );
};
const ModalInvite: React.FC<ModalProps> = ({ isOpen, closeModal, title, msg, color }) => {
  const router = Router;
  const context = useContext(MyContext);
  const handleAccept = () => {
    const url = `Game?room=${color}&queue=false`;
    router.push(`${process.env.Localhost}/${url}`)
  }

  const handleDecline = () => {
    if (context?.token)
      checkIs7rag(context?.token);
    if (context?.socket)
      context?.socket.emit("cancelGame", {
        host: color
      })
    closeModal()
  }
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-[#7e22ce] p-6 rounded-md`}>
        {
          title.length &&
          <div className="flex justify-center gap-2">
            <Star fill="gold" color='gold' />
            <Star className="pt-1" fill="gold" color='gold' />
            <Star fill="gold" color='gold' />
          </div>
        }
        <h2 className="text-2xl text-white font-bold mt-6 text-center">{title}</h2>
        <h2 className="text-2xl text-[#FFD700] font-bold mb-6 text-center">{msg}</h2>
        <div className="flex justify-end gap-2">
          {
            title.length &&
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={handleAccept}
            >
              Accept
            </button>
          }
          <button onClick={handleDecline} className="px-4 py-2 bg-red-200 text-gray-700 rounded hover:bg-red-300">Decline</button>
        </div>
      </div>
    </div>
  );
};
const ModalQRcode: React.FC<ModalProps> = ({ isOpen, closeModal, title, msg, color }) => {
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className=" absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-green-50 rounded-md`}>
        <div className="flex bg-orange-300 rounded-t-md w-full py-2 justify-center gap-2">
          <AlertCircle size="40" color='white' />
        </div>
        <div className="p-3">

          <h2 className="text-2xl text-gray-700 mx-7 font-semibold mt-6 text-center">{title}</h2>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={closeModal} className="px-4 py-2 m-2 bg-red-200 text-gray-700 rounded hover:bg-red-300">Close</button>
        </div>
      </div>
    </div>
  );
};

const ModalGameInvite = () => {
  const context = useContext(MyContext);
  const handleAccept = () => {
    const url = `Game?room=${context?.gameHost}&queue=false`;
    context?.setGameInvitation(false)
    router.push(`${process.env.Localhost}/${url}`)
  }
  const handleDecline = () => {
    if (context?.token)
      checkIs7rag(context?.token);
    if (context?.socket)
      context?.socket.emit("cancelGame", {
        host: context.gameHost
      })
    context?.setGameInvitation(false)
  }
  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ${context?.gameInvitation ? 'block' : 'hidden'} `}>
      <div className={`bg-orange-500 rounded-md flex flex-col w-[400px] h-[200px] p-6`}>
      <div className="flex justify-center gap-2">
            <Star fill="gold" color='gold' />
        <div className="text-center text-xl font-mono font-semibold">Game Invitation</div>
            <Star fill="gold" color='gold' />
          </div>
        <div className="w-full h-[80%] text-center text-lg flex justify-center items-center">
          <p >

            Play against {context?.gameHostUsername}
          </p>
        </div>
        <div className="flex justify-end gap-2">
        
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={handleAccept}
            >
              Accept
            </button>
        
          <button onClick={handleDecline} className="px-4 py-2 bg-red-200 text-gray-700 rounded hover:bg-red-300">Decline</button>
        </div>

      </div>
    </div>
  )

}


const ModalError = () => {
  const context = useContext(MyContext);

  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ${context?.error ? 'block' : 'hidden'}`}>
      <div className={`bg-orange-500 rounded-md flex flex-col w-[400px] h-[200px] p-6`}>
        <div className="text-center text-xl font-mono font-semibold">Error</div>
        <div className="w-full h-[80%] text-center text-lg flex justify-center items-center">
          <p >

            {context?.messageError}
          </p>
        </div>
        <div className="w-full h-[20%] flex items-center justify-end">

          <button className="bg-orange-600 px-2 py-1 rounded-lg text-white" onClick={() => context?.setError(false)}>close</button>
        </div>

      </div>
    </div>
  )

}
interface banner{
  isOpen: boolean;
  close: () => void;
}

const ModalListBanner = (props : banner) =>{
  if (!props.isOpen)
    return null;
    const GetAvatar = ({ avat }: { avat: string | undefined }) => {
      if (avat === '0')
        return (
          <Image src={Avatar} alt="ava" />
        );
      else
        return (
          <img src={avat} alt="ava" />
        );
    }
  const context = useContext(MyContext);
  const removeBan = (user : BanedType) =>{
    if (context?.token)
      checkIs7rag(context?.token);
    context?.socket?.emit('updateMember', {channelName: context.channelInfo?.channelName, loginAffected : user.login, isBlacklist : false})
    props.close();
    
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ">
      <div className=" w-1/2 h-1/2 bg-white rounded-lg">
        <div className="w-full h-full flex flex-col">
          <div className="w-full  h-[10%] text-base md:text-xl flex justify-center items-center">List of Banned</div>
          <div className="w-full  h-[80%] flex flex-col gap-1 px-2 overflow-y-auto">
            {
              context?.channelBanner.map((user) =>{
                return (
                  <div key={user.login} className="  min-w-full w-full h-[80px] min-h-[80px] bg-slate-200 rounded-2xl flex justify-between px-8 items-center">
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <GetAvatar avat={user.avatar} />
                      </div>
                    </div>
                    <div>{user.username}</div>
                    <div><button onClick={() => removeBan(user)}>
                    Remove
                      </button></div>
                  </div>
                );
              })
            }

          

          </div>
          <div className="w-full  h-[10%] flex justify-end items-center pr-6">
            <button className="bg-slate-400 py-1 px-2 rounded-lg text-white text-lg border-2 border-slate-500"  onClick={props.close}>close</button>
          </div>

        </div>

      </div>
    </div>
  );
}


const ModalDeleteAcount = () => {
  const context = useContext(MyContext);
  

  return (
    <div className={`absolute overflow-hidden inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ${context?.deleteAcount ? 'block' : 'hidden'}`}>
      <div className={`bg-white rounded-md flex flex-col w-[400px] h-[220px] p-6`}>
        <div className="text-center text-xl font-mono font-semibold text-orange-600">Remember</div>
        <div className="w-full h-[80%] text-center text-lg flex justify-center items-center">
        <p className="">Please note that if you delete your account, you will not be able to recover it.
          
      If you have any questions or concerns, please contact our customer support team.</p> 
          
        </div>
        <div className="w-full h-[20%] flex items-center justify-end py-6 gap-4">

          <button className="bg-slate-600 px-2 py-1 rounded-lg text-white" onClick={() => context?.setDeleteAcount(false)}>close</button>
          <button className="bg-red-600 px-2 py-1 rounded-lg text-white" onClick={() =>{
            context?.socket?.emit('deleteAccount');
             context?.setDeleteAcount(false)
             router.push('/');
             localStorage.clear();
          }}>Delete</button>
        </div>

      </div>
    </div>
  )

}
export default Modal;
export { ModalChat, ModalGameInvite, ModalCreateChannel, ModalUpdateChannel, ModalSearch, ModalGame, ModalJoin, ModalQRcode, ModalError, ModalListBanner , ModalDeleteAcount};