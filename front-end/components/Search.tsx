import axios, {AxiosError} from "axios";
import Router from "next/router";
import { headers } from "next/dist/client/components/headers";
import React, {useContext, useEffect, useState} from "react";
import { MyContext } from "./Context";
import {ModalError, ModalSearch} from "./Modal";
import { dataProp } from "./Modal";


const router = Router;
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
            try{
                const res = await axios.post(`${process.env.Search}`,{
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
            }catch (err : any){
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
        context?.socket.on('joinOther', (pay) =>{
          if (pay){
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
    
      
      
      context.socket.on('invite',(pay : any) =>{
        if (pay){
          const friend ={
            login : pay.login,
            username : pay.username,
            avatar : pay.avatar
          }
            const getDat = async () =>{
              try{
               
                const res = await axios.post(`${process.env.Friends}`, 
                {login : context.login},
                {
                  headers : {
                    Authorization : `Bearer ${context.token}`
                  }
                }
                )
                context.setPendingInvitation(res.data.waitToAccept);

              }catch(e){
              }
            }
            getDat()
        }
      })
      context.socket.on('errorJoin',(pay : any) =>{
          if (pay){
            if (pay.message !== 'jwt must be provided'){
             
              context.setMessageError(pay.message);
              context.setError(true);
            
            }
  
          }
      });
      context.socket.on('twoInvite',(pay : any) =>{
        if (pay){
          const fetchData = async () =>{
            try{
              const res = await axios.post(`${process.env.Friends}`,
              {
                login : context?.login
              },{
                headers : {
                  Authorization : ` Bearer ${context?.token}`
                }
              }
              )
              context.setFriends(res.data.friends);
              context.setWaitToAccept(res.data.pendingInvitation)
              context.setPendingInvitation(res.data.waitToAccept);
              // context.setF

            }catch (error) {
            }

          }
          fetchData();
          
          
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
      // context.socket.on('updateUser', )
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
      // {UserId: 'a165ab12-735a-4a2c-a4ed-18b97583d6e0', login: 'mhaddaou', username: 'medhaddaoui', email: 'mhaddaou@student.1337.ma', avatar: 'https://res.cloudinary.com/daczu80rh/image/upload/v1689478024/hastid_gwes2d.jpg', …} ' this is the pay'
      context.socket.on('updatedFriend', (pay) =>{
        if (pay){
          if (pay.isOnline){
            context.setOnligne((prev) => [...prev, pay.login])
          }
          
          const getData = async () =>{
            try{
                const history = await axios.get(`${process.env.ME}`, {headers:{
                  Authorization : `Bearer ${context.token}`
              }})
                  context.setMatch(history.data.matches);
                  if (pay.login === context.login)
                    return;
                  const res = await axios.post(
                    `${process.env.FindConversation}`,
                    { loginA: context?.login, loginB: pay.login },
                    {
                      headers: {
                        Authorization: `Bearer ${context?.token}`,
                      },
                    }
                  );
                  context?.setMessageInfo(res.data[0]);
                  context?.setMessageContent(res.data[1]);
                  const chatconver = await axios.post(
                    `${process.env.Conversations}`,
                    { login: context?.login },
                    {
                      headers: {
                        Authorization: `Bearer ${context?.token}`,
                      },
                    }
                  );
                  context.setContactChat(chatconver.data);
                  const friend = await axios.post(`${process.env.Friends}`,
                  {
                    login: context.login,
                  },
                  {
                    headers:{
                      Authorization : `Bearer ${context.token}`,
                    }
                  })
                  context?.setPendingInvitation(friend.data.waitToAccept);
                  context?.setWaitToAccept(friend.data.pendingInvitation);
                  context.setFriends(friend.data.friends);
            }catch(e){}
          
          }
          getData();
          const fetchLeaderBoard = async () =>{
            try{
              const res = await axios.get(`${process.env.Leaderboard}`,{
                headers:{
                  Authorization: `Bearer ${context?.token}`
                }
              })
              context?.setLeaderBoard(res.data);
            }catch(e){}
          }
          fetchLeaderBoard();
          
        }
      })
      context.socket.on('kick',(pay)=>{
        if (pay){
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
              context?.setChannels(res.data);
      
            } catch (error) {
            }
          };
        
          fetchData();

        }
      })
      context.socket.on('blockuser', (pay) =>{
        if (pay) {
          const getData = async () =>{
            try{
              const res = await axios.post(`${process.env.Friends}`, 
              {
                login: context.login,
              },
              {
                headers:{
                  Authorization : `Bearer ${context.token}`,
                }
              })
              context.setFriends(res.data.friends);
              context.setWaitToAccept(res.data.pendingInvitationt);
              context.setPendingInvitation(res.data.waitAccept);
            }catch(e){}

          }
          getData();
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
          context?.setShowChat(false);
        }
      })
      context.socket.on('privateMessage',(pay) =>{
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
      })
      context.socket.on('firstMsg', (pay) =>{
        if (pay){
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
        }
        
      })
      
      context.socket.on('staticsGame', (pay) =>{
        if (pay){
          context.setLosses(pay.lose);
          context.setWins(pay.win);
          const m : string = pay.lvl.toString();
          context?.setLevel((+m.substring(0,1)))
          context?.setLevlPer((+(m.substring(2.1))) * 10)
          const getData = async () =>{
            try{
              const res = await axios.get(`${process.env.ME}`, {headers:{
              Authorization : `Bearer ${context.token}`
          }})
              context.setMatch(res.data.matches);
            }catch(e){

            }
            
          }
          getData();


        }
      })
      context.socket.on('deleteAccount', (pay) =>{
        if (pay){
          const namech = localStorage.getItem('ChannelNameee')
          if (pay.login === context.login)
            return ;
          if (pay.login === context.login)
            return ;
          if (pay.login === context.nameDelete || pay.login === context.loginClick){
            context.setShowChat(false);
            context.setFetchChannel(true);
          }
          const fetData = async () =>{
            try{
              const friend = await axios.post(`${process.env.Friends}`,
              {
                login : context.login
              },{
                headers:{
                 Authorization : `Bearer ${context.token}`
                }
              })
              context.setFriends(friend.data.friends);
              context.setPendingInvitation(friend.data.waitToAccept);
              context.setWaitToAccept(friend.data.waitToAccep);
              const blocks = await axios.post(`${process.env.Blocks}`,
              {
                login : context?.login
              },{
                headers : {
                  Authorization : `Bearer ${context?.token}`
                }
              }
              )
              context?.setUserBlocked(blocks.data);
              const conversations = await axios.post(
                `${process.env.Conversations}`,
                { login: context?.login },
                {
                  headers: {
                    Authorization: `Bearer ${context?.token}`,
                  },
                }
              );
              context?.setContactChat(conversations.data);
              const channels = await axios.post(
                `${process.env.Memb}`,
                { login: context?.login },
                {
                  headers: {
                    Authorization: `Bearer ${context?.token}`,
                  },
                }
              );
              context?.setChannels(channels.data);
              if (context.channelHistory[0].channelName === namech){
                const messages = await axios.post(
                  `${process.env.AllMes}`,
                  {channelName: namech}, 
                  {
                    headers:{
                      Authorization : `Bearer ${context?.token}`,
                    },
                  }
                );
                context?.setChannelHistory(messages.data[1]);
              }
            }catch(e){}

          }
          fetData();
          if (namech){
            pay.channels.map((cha : string) =>{
              if (namech === cha){
                context.setShowChannel(false);
              }

            })
          }
          
          
          
        }
      })
      
      context.socket.on('updateChannel', (pay) =>{
        if (pay){
          context.setChannelInfo(pay);
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
              context?.setChannels(res.data);
              const resp = await axios.post(
                `${process.env.AllMes}`,
                {channelName: pay.channelName}, 
                {
                  headers:{
                    Authorization : `Bearer ${context?.token}`,
                  },
                }
              );
              context.setChannelInfo(resp.data[0])
      
            } catch (error) {
            }
          };
        
          fetchData();
        }
      
        
      })
      context.socket.on('errorMessage', (pay) =>{
       


        if (pay){
          if (pay.message !== 'jwt must be provided'){
           
            context.setMessageError(pay.message);
            context.setError(true);
          
          }

        }
      })
      
    }

  
    return () => {
      if (context?.socket) {
        context.socket.off('invite');
        context.socket.off('accept');
        context.socket.off('delete');
        context.socket.off('kick');
        context.socket.off('updateChannel');
        context.socket.off('errorMessage');
        context.socket.off('cancelInvitation');
        context.socket.off('blockuser');
        context.socket.off('updatedFriend');
        context.socket.off('firstMsg');
        context.socket.off('errorJoin');
        context.socket.off('twoInvite');
        context.socket.off('staticsGame');
        // context.socket.off('errorCreateChannel');
        
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.socket, context?.waitToAccept]);

  
  return (
<div className="container relative left-0 z-40 flex w-3/4 h-auto md:h-full ">
    {isOpen && <ModalSearch isOpen={isOpen} closeModal={closeModale}   />}
                            <div className="relative flex items-center w-full h-20 lg:w-64 group">
                                <div className="absolute z-50 flex items-center justify-center  w-auto h-10 p-3 pr-2 text-sm text-gray-500 uppercase cursor-pointer sm:hidden">
                                    <svg fill="none" className="relative w-5 h-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z">
                                        </path>
                                    </svg>
                                </div>
                                <svg className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z">
                                    </path>
                                </svg>
                                <input id="search" type="text" value={inputeValue} onKeyPress={handlKeyPres} onChange={handlChange} className={`input input-bordered block w-full ${page === 'Setting' ?'h-[50%]' :'h-ful' } py-1.5 pl-10 pr-4 leading-normal rounded-2xl   ring-opacity-90 bg-gray-100  text-gray-400 aa-input`} placeholder="Search"/>
                                    <div className="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-2xl md:block">
                                        +
                                    </div>
  </div>
                            </div> 
    );
}
export default Search;