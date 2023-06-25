import axios, {AxiosError} from "axios";
import { headers } from "next/dist/client/components/headers";
import React, {useContext, useEffect, useState} from "react";
import { MyContext } from "./Context";
import {ModalSearch} from "./Modal";
import { dataProp } from "./Modal";
const Search = ({page } : {page : string})=>{
    const context = useContext(MyContext);
    const [inputeValue, setInputValue] = useState('')
    const [data, setData] = useState<dataProp | undefined>(undefined)
    const [isOpen, setIsOpen] = useState(false);
  const handlChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
    setInputValue(e.target.value);
  }
  const handlKeyPres = async (e : React.KeyboardEvent<HTMLInputElement>) =>{
    if (e.key === 'Enter'){
        if (inputeValue != ''){
            console.log(inputeValue)
            try{
                const res = await axios.post("http://localhost:5000/user/search",{
                    search : inputeValue,
                },
                {
                    headers:{
                        Authorization : `Bearer ${context?.token}`
                    }
                }
                )
                context?.setUserSearch(res.data[0].userSearch);
                context?.setChannelSearch(res.data[1].channelSearch);
                console.log(res.data[1].channelSearch)
            }catch (err : any){
                console.log('not found')
            }
            openModal();
            
        }
    }
}
const openModal = () =>{
    setIsOpen(true);
}
const closeModale = () =>{
    setInputValue('')
    setIsOpen(false)
  }
  const removeChat = (channel : string) =>{
    context?.setChannels(prevcontact =>
      prevcontact.filter(chat => chat.channelName !== channel))
  }

  useEffect(() =>{
    if (context?.socket){
        context.socket.on('channelRemoved', (pay) =>{
          if (pay){
            const fetchData = async () => {
              try {
                const res = await axios.post(
                  'http://localhost:5000/chat/memberships',
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
                console.error('Error fetching data:', error);
              }
            };
          
            fetchData();

          }
        })
        context?.socket.on('joinOther', (pay) =>{
          if (pay){
            console.log('her channel name ', pay)
            const fetchData = async () => {
              try {
                const res = await axios.post(
                  'http://localhost:5000/chat/memberships',
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
                console.error('Error fetching data:', error);
              }
            };
          
            fetchData();
            // const GetDat = async () =>{
            //   const res = await axios.post(
            //     'http://localhost:5000/chat/channel/message/all',
            //     {channelName: pay.channelName}, 
            //     {
            //       headers:{
            //         Authorization : `Bearer ${context?.token}`,
            //       },
            //     }
            //   );
            // }
          }
        })
        
        context?.socket.on('join', (pay)=>{
          if (pay){
            console.log('her channel name ', pay)
            const fetchData = async () => {
              try {
                const res = await axios.post(
                  'http://localhost:5000/chat/memberships',
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
                console.error('Error fetching data:', error);
              }
            };
          
            fetchData();
            // const GetDat = async () =>{
            //   const res = await axios.post(
            //     'http://localhost:5000/chat/channel/message/all',
            //     {channelName: pay.channelName}, 
            //     {
            //       headers:{
            //         Authorization : `Bearer ${context?.token}`,
            //       },
            //     }
            //   );
            // }
          }
        })
        
        context.socket.on('errorJoin' , (pay) =>{
            if (pay){
              console.log(pay)
              console.log('this is error')
            }
        })
    }


  },[context?.socket])

  const rmv = (login: string) => {
    context?.setWaitToAccept(prev =>
      prev.filter(friend => friend.login !== login)
    );
  };
  // const removeChannelByName = (login: string) => {
  //   context?.setWaitToAccept(prev =>
  //     prev.filter(friend => friend.login !== login)
  //   );
  // };
  const rmvFriend = (login: string) => {
    context?.setFriends(prev =>
      prev.filter(friend => friend.login !== login)
    );
  };
  const rmvPend = (login: string) => {
    context?.setPendingInvitation(prev =>
      prev.filter(friend => friend.login !== login)
    );
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameRoom, setGameRoom] = useState("")
  const [mms, setMesg] = useState('');
  const [name, setName] = useState('');


  useEffect(() => {
    if (context?.socket) {
    //   context.socket.on('gameInvitation', (payload: any) => {
        
    //     console.log("game invite response ")
    //     if (payload && payload.sender) {
    //       setGameRoom(payload.sender)
    //       setIsModalOpen(true)
          
    //     }
    //     console.log(payload)
    //   });
      
      context.socket.on('PrivateMessage', (payload: any) => {
        console.log('Received payload:', payload);
        // Check the payload object in the browser console
        // to see if sender and receiver properties are present and correct
        if (payload) {
          setMesg(payload.content);
          setName(payload.sender);
          console.log(payload.content, payload.sender, payload.receiver);
          if (!document.hidden) {
            // Show a notification
            console.log('newMsg from ', payload.sender);
           openModal();
          } else {
            console.log("msg and not in this page");
          }
        }
      });
      context.socket.on('invite',(pay : any) =>{
        if (pay){
          console.log(pay);
          const friend ={
            login : pay.login,
            username : pay.username,
            avatar : pay.avatar
          }

            context.setPendingInvitation((prev) =>[...prev,friend])
        }
      })
      context.socket.on('accept',(pay) =>{
        if (pay){
          rmv(pay.login);
          context.setFriends((prev) => [...prev, {login : pay.login, avatar: pay.avatar, username: pay.username}])
        }
      })
      context.socket.on('decline', (pay) =>{
        if (pay){
          if (pay.login !== context.login){

            rmv(pay.login);
          }
        }
      })
      context?.socket.on('delete', (pay) =>{
        if (pay){
          rmvFriend(pay.login);
        }
      })
      context.socket.on('cancelInvitation', (pay) =>{
        if (pay){
          rmvPend(pay.login)
        }
      })
      context.socket.on('kick',(pay)=>{
        if (pay){
          const fetchData = async () => {
            try {
              const res = await axios.post(
                'http://localhost:5000/chat/memberships',
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
              console.error('Error fetching data:', error);
            }
          };
        
          fetchData();

        }
      })
      context.socket.on('Update', (pay) =>{
        if (pay)
          console.log(pay);
      })
      context.socket.on('errorMessage', (pay) =>{
        if (pay){
          context.setMessageError(pay.message);
          context.setError(true);

        }
          // console.log(pay);
      })
      
    }

  
    return () => {
      if (context?.socket) {
        context.socket.off('PrivateMessage');
        context.socket.off('invite');
        context.socket.off('accept');
        context.socket.off('delete');
        context.socket.off('kick');
        context.socket.off('Update');
        context.socket.off('errorMessage');
        context.socket.off('cancelInvitation');
        // context.socket.off('gameInvitation');
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.socket, context?.waitToAccept]);

  
  return (
<div className="container relative left-0 z-40 flex w-3/4 h-auto md:h-full ">
    {isOpen && <ModalSearch isOpen={isOpen} closeModal={closeModale}   />}
                            <div className="relative flex items-center w-full h-20 lg:w-64 group">
                                <div className="absolute z-50 flex items-center justify-center  w-auto h-10 p-3 pr-2 text-sm text-gray-500 uppercase cursor-pointer sm:hidden">
                                    <svg fill="none" className="relative w-5 h-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z">
                                        </path>
                                    </svg>
                                </div>
                                <svg className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z">
                                    </path>
                                </svg>
                                <input type="text" value={inputeValue} onKeyPress={handlKeyPres} onChange={handlChange} className={`input input-bordered block w-full ${page === 'Setting' ?'h-[50%]' :'h-ful' } py-1.5 pl-10 pr-4 leading-normal rounded-2xl   ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input`} placeholder="Search"/>
                                    <div className="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-2xl md:block">
                                        +
                                    </div>
                                </div>
                            </div>
    );
}
export default Search;