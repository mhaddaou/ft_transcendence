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
            if (context.nameDelete === pay.channelName || context.loginClick === pay.channelName)
              context.setShowChannel(false);
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
      
      
      context.socket.on('invite',(pay : any) =>{
        if (pay){
          console.log(pay);
          const friend ={
            login : pay.login,
            username : pay.username,
            avatar : pay.avatar
          }

            // context.setPendingInvitation((prev) =>[...prev,friend])
            const getDat = async () =>{
              try{
                const resp = await axios.post('http://localhost:5000/user/friends', 
                {login : context?.login}, 
                {
                  headers: {
                    Authorization : `Bearer ${context?.token} `

                  }
                });
                console.log(resp);
                const res= await axios.post('http://localhost:5000/user/friends',
                {login : context.login},
                {
                  headers : {
                    Authorization : `Bearer ${context.token}`
                  }
                }
                )
                context.setPendingInvitation(res.data.waitToAccept);
                console.log('this fro event invite j',res.data )

              }catch(e){
                console.log(e);
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
          console.log(pay, 'twoInvite');
          const fetchData = async () =>{
            try{
              const res = await axios.post('http://localhost:5000/user/friends',
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
//               friends
// : 
// [{…}]
// pendingInvitation
// : 
// []
// waitToAccept
// : 
// []
              console.log(res.data)
              // context.setF

            }catch (error) {
              console.log(error)
            }

          }
          fetchData();
          
          
        }
      })

      // context.socket.on('updatedFriend', (pay) =>{
      //   if (pay){
      //     console.log('this is updated ', pay);
      //   }
      // })
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
      context.socket.on('updatedFriend', (pay) =>{
        if (pay){
          console.log('updatedFriend  ', pay);
          if (pay.login === context.login)
            return;
          const getData = async () =>{
            const res = await axios.post(
              "http://localhost:5000/chat/findConversation",
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
              'http://localhost:5000/chat/conversations',
              { login: context?.login },
              {
                headers: {
                  Authorization: `Bearer ${context?.token}`,
                },
              }
            );
            context.setContactChat(chatconver.data);
            const friend = await axios.post('http://localhost:5000/user/friends',
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
          }
          getData();
          const fetchLeaderBoard = async () =>{
            const res = await axios.get('http://localhost:5000/user/Leaderboard',{
              headers:{
                Authorization: `Bearer ${context?.token}`
              }
            })
            context?.setLeaderBoard(res.data);
          }
          fetchLeaderBoard();
          
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
              context?.setChannels(res.data);
      
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
        
          fetchData();

        }
      })
     
      // context.socket.on('errorCreateChannel',(pay)=>{
      //   if (pay){
      //     console.log('this is errorCreateChannel ', pay.message);
      //   }
      // })
      
      context.socket.on('blockuser', (pay) =>{
        if (pay) {
          const getData = async () =>{
            const res = await axios.post('http://localhost:5000/user/friends', 
            {
              login: context.login,
            },
            {
              headers:{
                Authorization : `Bearer ${context.token}`,
              }
            })
            console.log('this all  friends  and not friend  ', res.data);
            context.setFriends(res.data.friends);
            context.setWaitToAccept(res.data.pendingInvitationt);
            context.setPendingInvitation(res.data.waitAccept);

          }
          getData();
          const fetchData = async () => {
            try {
              const res = await axios.post(
                'http://localhost:5000/chat/conversations',
                { login: context?.login },
                {
                  headers: {
                    Authorization: `Bearer ${context?.token}`,
                  },
                }
              );
              context?.setContactChat(res.data);
      
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
        
          fetchData();
          context?.setShowChat(false);
        }
        console.log('ths is block ', pay);
      })
      context.socket.on('privateMessage',(pay) =>{
        console.log('message received');
        const fetchData = async () => {
          try {
            const res = await axios.post(
              'http://localhost:5000/chat/conversations',
              { login: context?.login },
              {
                headers: {
                  Authorization: `Bearer ${context?.token}`,
                },
              }
            );
            context?.setContactChat(res.data);
    
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      })
      context.socket.on('firstMsg', (pay) =>{
        if (pay){
          const fetchData = async () => {
            try {
              const res = await axios.post(
                'http://localhost:5000/chat/conversations',
                { login: context?.login },
                {
                  headers: {
                    Authorization: `Bearer ${context?.token}`,
                  },
                }
              );
              context?.setContactChat(res.data);
      
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
        
          fetchData();
          
        }
        
      })
      context.socket.on('deleteAccount', (pay) =>{
        if (pay){
          console.log('Deleting account')
          if (pay.login === context.login)
            return ;
          if (pay.login === context.nameDelete || pay.login === context.loginClick){
            context.setShowChat(false);
            context.setFetchChannel(true);
          }
          const fetData = async () =>{
            const friend = await axios.post('http://localhost:5000/user/friends',
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
            const blocks = await axios.post('http://localhost:5000/user/blocks',
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
              'http://localhost:5000/chat/conversations',
              { login: context?.login },
              {
                headers: {
                  Authorization: `Bearer ${context?.token}`,
                },
              }
            );
            context?.setContactChat(conversations.data);
              
            // const res = await axios.post(
            //   'http://localhost:5000/chat/channel/message/all',
            //   {channelName: context.loginClick}, 
            //   {
            //     headers:{
            //       Authorization : `Bearer ${context?.token}`,
            //     },
            //   }
            // );
            // console.log('deleted acount in mssage channel ,', res.data[1])
            // context?.setChannelHistory(res.data[1]);
          }
          fetData();
          
          
        }
      })
      // this for if you are open many window
      context.socket.on('deleteMyAccount', (pay) =>{
        if (pay){

          console.log('deleteMyAccount  ', pay);
        }

      });
      context.socket.on('updateChannel', (pay) =>{
        if (pay){
          // console.log('this is pay ', pay);
          context.setChannelInfo(pay);
          console.log('this is pass ', context.channelInfo?.ispassword)
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
              context?.setChannels(res.data);
              const resp = await axios.post(
                'http://localhost:5000/chat/channel/message/all',
                {channelName: pay.channelName}, 
                {
                  headers:{
                    Authorization : `Bearer ${context?.token}`,
                  },
                }
              );
              context.setChannelInfo(resp.data[0])
      
            } catch (error) {
              console.error('Error fetching data:', error);
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
          // console.log(pay);
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
        context.socket.off('deleteAccount');
        context.socket.off('twoInvite');
        // context.socket.off('createChannel');
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
                                    <svg fill="none" className="relative w-5 h-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z">
                                        </path>
                                    </svg>
                                </div>
                                <svg className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z">
                                    </path>
                                </svg>
                                <input type="text" value={inputeValue} onKeyPress={handlKeyPres} onChange={handlChange} className={`input input-bordered block w-full ${page === 'Setting' ?'h-[50%]' :'h-ful' } py-1.5 pl-10 pr-4 leading-normal rounded-2xl   ring-opacity-90 bg-gray-100  text-gray-400 aa-input`} placeholder="Search"/>
                                    <div className="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-2xl md:block">
                                        +
                                    </div>
                                </div>
                            </div>
    );
}
export default Search;