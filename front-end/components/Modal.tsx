import React, { useContext, useEffect, useRef, useState } from "react";
import { InfoChannelProp, MyContext, channelSearchProps } from "./Context";
import { Star, AlertCircle } from 'react-feather'
import Avatar from '../image/avatar.webp'
import Image, { StaticImageData } from "next/image";
import { FriendType } from "./Context";
import { userSearchProps } from "./Context";
import Router from "next/router";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
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
    if (value.current) {
      if (context?.socket) {
        context.socket.emit('PrivateMessage', {
          receiver: login,
          content: value.current.value
        })
        context.socket.on('message', (payload: any) => {
          console.log("111111111111111");
          console.log(`Received message: ${payload}`);
          // SetToMessages(payload);
          // setMessages([...messages, payload]);
        });

      }
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
  const [file, setFile] = useState<File | null>(null)
  let imgSrc: string | Blob | MediaSource | StaticImageData;
  const [url, setUrl] = useState<string | null>(null);
  const [avatar, setAvatar] = useState("")
  function sendToBck(Url: string) {
    if (context?.socket) {
      context?.socket.emit("updateUser", { avatar: Url });
    }
  }


  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      const form = new FormData();

      if (file) {
        form.append("file", file);
        form.append("upload_preset", "mhaddaou");

        if ((file.type !== "image/jpeg") && (file.type !== "image/png")) {
          setColor('bg-orange-600');
          setMsg('this image is not jpeg or PNG');
          setTitle('Warning!');
          setIsModalOpen(true);
          reject('Invalid image type');
        } else if ((file.size / (1024 * 1024)) > 10) {
          setColor('bg-orange-600');
          setMsg('this image is more than 6MB');
          setTitle('Warning!');
          setIsModalOpen(true);
          reject('Image size is too large');
        } else {
          axios.post("https://api.cloudinary.com/v1_1/daczu80rh/upload", form)
            .then((result) => {
              setUrl(result.data.secure_url);
              // context?.setImg(result.data.secure_url);
              setAvatar(result.data.secure_url);
              // export interface InfoChannelProp{
              //   ChannelId : string;
              //   LoginOwner: string;
              //   avatar: string;
              //   channelName : string;
              //   createdAt: string;
              //   isPrivate : boolean;
              //   ispassword: boolean;
              // }
              if (context?.channelInfo) {
                const obt = {
                  ChannelId: context?.channelInfo?.ChannelId,
                  LoginOwner: context?.channelInfo?.LoginOwner,
                  avatar: result.data.secure_url,
                  channelName: context?.channelInfo?.channelName,
                  createdAt: context?.channelInfo?.createdAt,
                  isPrivate: context?.channelInfo?.isPrivate,
                  ispassword: context?.channelInfo?.ispassword,
                }
                context?.setChannelInfo(obt)
              }
              setColor('bg-green-500');
              setMsg('The image was successfully uploaded');
              setTitle('Success!');
              setIsModalOpen(true);
              resolve(`${result.data.secure_url}`);
            })
            .catch((error) => {
              reject(error);
            });
        }
        setFile(null);
      } else {
        setColor('bg-orange-600');
        setMsg('the image is empty');
        setTitle('Warning!');
        setIsModalOpen(true);
        reject('No image selected');
      }
    });
  };
  const passref = useRef<HTMLInputElement | null>(null);
  const chanref = useRef<HTMLInputElement | null>(null);
  const [msg, setMsg] = useState('');
  const [color, setColor] = useState('');
  const [title, setTitle] = useState('');
  const context = useContext(MyContext);
  useEffect(() => {
    if (context?.socket)
      context?.socket.on('message', (pay) => {
        console.log(pay);
        setMsg(pay);
        setColor('bg-green-400');
        setTitle('Success');
        openModal()
      })
    if (context?.socket)
      context?.socket.on('errorMessage', (pay) => {
        console.log(pay)
        setMsg(pay.message);
        setColor('bg-orange-400');
        setTitle('Failed');
        openModal()
      })
    return () => {
      context?.socket?.off('errorMessage');
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
    avatar: string;
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

  const Update = () => {
    if (pass && check) {
      if (chanref.current && passref.current)
        updateChannel(chanref.current.value, check, pass, passref.current.value)
    }
    else if (pass) {
      if (chanref.current && passref.current)
        updateChannel(chanref.current.value, check, pass, passref.current.value)
    }
    else if (check) {
      if (context?.channelInfo)
        updateChannel(context.channelInfo.channelName, check, pass, "")
    }
    else {
      if (chanref.current) {
        updateChannel(chanref.current.value, check, pass, "")
      }
    }
  }

  function updateChannel(channel: string, isPrivat: boolean, pass: boolean, password: string) {
    var msg: newChannel | string = '';
    if (chanref.current) {
      uploadImage().then((secureUrl) => {
        if (chanref.current) {
          msg = {
            avatar: `${secureUrl}`,
            channelName: channel,
            isPrivate: isPrivat,
            ispassword: pass,
            password: password,
          }
          context?.socket?.emit('updateChannel', msg)
          const removeChannelByName = (channelName: string) => {
            context?.setChannels(prevChannels =>
              prevChannels.filter(channel => channel.channelName !== channelName)
            );
          };
          removeChannelByName(channel)
          context?.setChannels((prev) => [...prev, { avatar: `${secureUrl}`, channelName: channel }])
        }
      })
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModale = () => {
    setIsModalOpen(false);
  };
  const [value, setValue] = useState(context?.channelInfo?.channelName);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("tries to upload")
    if (e.target.files)
      setFile(e.target.files[0]);


  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModale} title={title} msg={msg} color={color} />}
      <div className={`bg-white p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-4">Update Channel</h2>
        <div className="bg-re mb-5 flex flex-col gap-2 pt-4">
          <div className="font-semibold mb-2 font-mono">
            <p className="mb-1" >Avatar <span className="text-xs">
              (optional)
            </span>
            </p>
            <label className=" cursor-pointer flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded" >
              <input onChange={handleUpload} type="file" className="hidden" />
              select file
            </label>
          </div>
          <div className="font-semibold font-mono">

            <p >Channel Name</p>
            <input type="text" value={value} onChange={handleChange} ref={chanref} placeholder="Name Channel" className="input input-bordered input-sm w-full max-w-xs" />
          </div>
          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Password</span>
              <input type="checkbox" ref={passref} onClick={clickPass} checked={pass} className="checkbox" />
            </label>
          </div>
          <input type="password" placeholder="Password" className="input input-bordered input-sm w-full max-w-xs" />



          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Private Channel</span>
              <input type="checkbox" onClick={clickcheck} checked={check} className="checkbox" />
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
            onClick={Update}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalCreateChannel: React.FC<ModalChannel> = ({ isOpen, closeModal }) => {
  const passref = useRef<HTMLInputElement | null>(null);
  const chanref = useRef<HTMLInputElement | null>(null);
  const [msg, setMsg] = useState('');
  const [color, setColor] = useState('');
  const [title, setTitle] = useState('');
  const context = useContext(MyContext);
  useEffect(() => {
    if (context?.socket)
      context?.socket.on('message', (pay) => {
        console.log(pay);
        setMsg(pay);
        setColor('bg-green-400');
        setTitle('Success');
        openModal()
        if (chanref.current) {
          const chann = {
            avatar: "0",
            channelName: chanref.current.value,
          }
          context.setChannels((old) => [...old, chann]);
        }
      })
    if (context?.socket)
      context?.socket.on('errorMessage', (pay) => {
        console.log(pay)
        setMsg(pay.message);
        setColor('bg-orange-400');
        setTitle('Failed');
        openModal()
      })
    return () => {
      context?.socket?.off('erroMessage');
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

  const Create = () => {
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
        console.log('this what i send ', msg)

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

        context?.socket?.emit('newChannel', msg)
      }
      // closeModal()

    }
    else {

      var msg: newChannel | string = '';

      if (chanref.current) {
        console.log(chanref.current.value);
        msg = {
          channelName: chanref.current.value,
          isPrivate: check,
          ispassword: pass,
          password: '',
        }
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModale} title={title} msg={msg} color={color} />}
      <div className={`bg-white p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-4">Create Channel</h2>
        <div className="bg-re mb-5 flex flex-col gap-2 pt-4">
          <div className="font-semibold font-mono">
            <p >name of channel</p>
            <input type="text" ref={chanref} placeholder="Name Channel" className="input input-bordered input-sm w-full max-w-xs" />
          </div>
          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Password</span>
              <input type="checkbox" onClick={clickPass} checked={pass} className="checkbox" />
            </label>
          </div>
          <input type="password" ref={passref} placeholder="Password" className="input input-bordered input-sm w-full max-w-xs" />



          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Private Channel</span>
              <input type="checkbox" onClick={clickcheck} checked={check} className="checkbox" />
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
          <input type="password" placeholder="Type Password" onClick={() => setColor('input-success')} ref={value} className={`input input-bordered  w-full max-w-xs ${color} `} />
          <p>{msg}</p>

        </div>
      );
    }
    else {
      context?.socket?.emit('joinChannel', { channelName: props.channel.channelName })
      setHidden('hidden')
      return (
        <div>your are joined</div>
      );
    }
  }

  const JoinChannelPass = () => {
    if (value.current)
      context?.socket?.emit('joinChannel', { channelName: props.channel.channelName, password: value.current.value })



  }
  // useEffect(() =>{
  //   if (context?.socket){
  //     context?.socket.on('errorJoin', (pay) =>{
  //       if (pay ){
  //         console.log('this is error join ' , pay);
  //         setMsg(pay.message);
  //         setColor('input-error')
  //       }
  //     })
  //     context.socket.on('join', (pay) =>{
  //       if (pay){
  //         console.log('this for you are join channel pass ', pay);
  //         const GetDat = async () =>{
  //           const res = await axios.post(
  //             'http://localhost:5000/chat/channel/message/all',
  //             {channelName: login}, 
  //             {
  //               headers:{
  //                 Authorization : `Bearer ${context?.token}`,
  //               },
  //             }
  //           );
  //         }
  //         props.closeModal();
  //         props.closeModalSearch()
  //       }
  //     })

  //   }
  //   return () =>  {
  //       // context?.socket?.off('join');
  //       context?.socket?.off('errorJoin');
  //   };

  // }, [context?.socket])

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
    context?.setWaitToAccept(prevcontact =>
      prevcontact.filter(chat => chat.login !== login))
  }


  const sendInvite = (user: userSearchProps) => {

    if (user.login) {
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
      context?.setWaitToAccept((prev) => [...prev, friend])

      // when i add this
    }
    props.closeModal()
    context?.setChn(true);
    console.log(user.login);
  }


  useEffect(() => {
    if (context?.socket) {
      context.socket.on('message', (pay) => {
        if (pay)
          console.log(pay);
      })

    }
  }, [context?.socket])
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
  const clickJoin = (channel: channelSearchProps) => {
    console.log('click')
    setChannel(channel);
    // props.closeModal();
    openModaleJoin();
  }
  const [channel, setChannel] = useState<channelSearchProps>()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ">
      <ModalChat isOpen={isModalOpen} closeModal={closeModal} name={name} login={login} />
      {channel && <ModalJoin isOpen={openModalJoin} closeModal={closeModalJoin} channel={channel} closeModalSearch={props.closeModal} />}

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
                  <div className="w-full min-h-[60px] bg-slate-100 flex items-center rounded-xl justify-around">
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
                  <div className="w-full min-h-[60px] bg-slate-100 flex items-center rounded-xl justify-around">
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
          <button className="px-4 py-2 bg-red-200 text-gray-700 rounded hover:bg-red-300">Leave</button>
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
    router.push(`http://localhost:3000/${url}`)
  }

  const handleDecline = () => {
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
export default Modal;
export { ModalChat, ModalInvite, ModalCreateChannel, ModalUpdateChannel, ModalSearch, ModalGame, ModalJoin, ModalQRcode, ModalError };
