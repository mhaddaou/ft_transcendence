import React, { use, useContext, useEffect, useState } from 'react';
import Statics from '../../image/statics.svg'
import 'react-circular-progressbar/dist/styles.css';
import LevelStatics, {Stats} from '@/components/Statics'
import RealFooter from '@/components/RealFooter';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import {DataFunction, CallBarLeft} from '@/components/Functions';
import NavBar from '@/components/NavBar';
import { MyContext , ContextTypes, FriendType} from '@/components/Context';
import Modal, { ModalInvite } from '@/components/Modal';
import axios from 'axios';
import {io} from "socket.io-client";
import createSocketConnection from '@/components/socketConnection'
import { useRouter } from 'next/router';
import { MesgType } from '@/components/Context';
import { Sleeping } from 'matter-js';
import { Socket } from 'dgram';
// import { initSocketConnection, getSocket } from '@/components/socketConnection';

var i = 0;


function usleep(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds);
  });
}





export default  function Progress() {
  const context = useContext(MyContext);

  const router = useRouter();
  const [mms, setMesg] = useState('');
  const [name, setName] = useState('');
    const [gameRoom, setGameRoom] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);


  

  useEffect(() =>{
    context?.setSocket(createSocketConnection(context?.token))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[context?.token])
  
  if (context?.socket){
    context?.socket.on('message',(paylo) =>{
      console.log(paylo);
    })
  }

  const openModal = () => {
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const rmv = (login: string) => {
  //   context?.setWaitToAccept(prev =>
  //     prev.filter(friend => friend.login !== login)
  //   );
  // };
  // const rmvFriend = (login: string) => {
  //   context?.setFriends(prev =>
  //     prev.filter(friend => friend.login !== login)
  //   );
  // };
  // const rmvPend = (login: string) => {
  //   context?.setPendingInvitation(prev =>
  //     prev.filter(friend => friend.login !== login)
  //   );
  // };
  const [user, SetUser] = useState<FriendType>()
     

  // useEffect(() => {
  //   if (context?.socket) {
  //     context.socket.on('gameInvitation', (payload: any) => {
        
  //       console.log("game invite response ")
  //       if (payload && payload.sender) {
  //         setGameRoom(payload.sender)
  //         setIsModalOpen(true)
          
  //       }
  //       console.log(payload)
  //     });
      
  //     context.socket.on('PrivateMessage', (payload: any) => {
  //       console.log('Received payload:', payload);
  //       // Check the payload object in the browser console
  //       // to see if sender and receiver properties are present and correct
  //       if (payload) {
  //         setMesg(payload.content);
  //         setName(payload.sender);
  //         console.log(payload.content, payload.sender, payload.receiver);
  //         if (!document.hidden) {
  //           // Show a notification
  //           console.log('newMsg from ', payload.sender);
  //          openModal();
  //         } else {
  //           console.log("msg and not in this page");
  //         }
  //       }
  //     });
  //     context.socket.on('invite',(pay : any) =>{
  //       if (pay){
  //         console.log(pay);
  //         const friend ={
  //           login : pay.login,
  //           username : pay.username,
  //           avatar : pay.avatar
  //         }

  //           context.setPendingInvitation((prev) =>[...prev,friend])
  //       }
  //     })
  //     context.socket.on('accept',(pay) =>{
  //       if (pay){
  //         rmv(pay.login);
  //         context.setFriends((prev) => [...prev, {login : pay.login, avatar: pay.avatar, username: pay.username}])
  //       }
  //     })
  //     context.socket.on('decline', (pay) =>{
  //       if (pay){
  //         if (pay.login !== context.login){

  //           rmv(pay.login);
  //         }
  //       }
  //     })
  //     context?.socket.on('delete', (pay) =>{
  //       if (pay){
  //         rmvFriend(pay.login);
  //       }
  //     })
  //     context.socket.on('cancelInvitation', (pay) =>{
  //       if (pay){
  //         rmvPend(pay.login)
  //       }
  //     })
  //   }

  
  //   return () => {
  //     if (context?.socket) {
  //       context.socket.off('PrivateMessage');
  //       context.socket.off('invite');
  //       context.socket.off('accept');
  //       context.socket.off('delete');
  //       context.socket.off('cancelInvitation');
  //       context.socket.off('gameInvitation');
  //     }
  //   };
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [context?.socket, context?.waitToAccept]);
  
  
  




  // context?.friends.map((friend) =>{
  //   console.log(friend.username);
  // })
  const [isPageReloaded, setIsPageReloaded] = useState(false);

  useEffect(() => {
    if (window.performance && window.performance.navigation.type === 1) {
      setIsPageReloaded(true);
      console.log("is refreching")
    }
  }, []);


  

  //  if (!context?.socket){
  //        if (context?.token && i == 0){
  //          i++;
  
  //          var socket = io("http://localhost:3333", {
  //                extraHeaders: {
  //                    Authorization: context?.token,
  //            }
  //            });
  //            socket.on('message', (payload: any) => {
  //                console.log("111111111111111");
  //                console.log(`Received message: ${payload}`);
  //                // SetToMessages(payload);
  //                // setMessages([...messages, payload]);
  //              });
  //              socket.on('errorMessage', (payload: any) => {
  //                console.log("111111111111111");
    
  //                console.log(`Received message: ${payload}`);
  //                // SetToMessages(payload);
  //                // setMessages([...messages, payload]);
  //              });
  //              context.setSocket(socket);
  //        }
  //      }
  //      else{
  //       context.socket.on('message', (payload: any) => {
  //         console.log("111111111111111");
  //         console.log(`Received message: ${payload}`);
  //         // SetToMessages(payload);
  //         // setMessages([...messages, payload]);
  //       });
  //       context.socket.on('errorMessage', (payload: any) => {
  //         console.log("111111111111111");

  //         console.log(`Received message: ${payload}`);
  //         // SetToMessages(payload);
  //         // setMessages([...messages, payload]);
  //       });

  //      }

      
    
 // Replace with your server URL

// Handle the connect event

  

  


  
  
 // Assuming you have already established the Socket.IO connection
// context?.socket.on('connect', () => {
//   socket.emit('connectCallBack', { token: 'your_token_here' }); // Replace 'your_token_here' with the actual token value
// });

  
  const fet = async () => {
    
    // const requestData = {
    //   // Your request body data here
    //   login: 'mhaddaou',
    // };
    // try{
    //   const res = await axios.post('http://localhost:5000/user/findLogin', 
    //     {username : 'mohamed haddaoui'},
    //     {
    //     headers: {
    //       Authorization: `Bearer ${context?.token}`,
    //     },
    //   });
    
    //   const response = await res.data;
    //   console.log("this is login of user name " ,response);

    // }catch(e){
    //   console.error(e);
    // }
  
  };
  
   useEffect(()=>{
    fet();
   },[])


  // const {name = UseMyContext();
  // const [border, setBorder]
  const[check, setCheck] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() =>{
    if (context?.socket)
    context.socket.on('gameInvitation', (payload: any) => {
        
      console.log("game invite response ")
      if (payload && payload.sender) {
        setGameRoom(payload.sender)
        setIsModalOpen(true)
        
      }
      console.log(payload)
    });
    return () =>{
      if (context?.socket){
        context.socket.off('gameInvitation')
      }
    }
  }, [context?.socket])

 
  
  
  const clickHistory = () => {
    setCheck(1);
  }

  const clickAchie = () => {
    setCheck(2);

  }

  const clickFriend = () => {
    setCheck(3);
  }
  const clickSent = () =>{
    // console.log('sent')
    setCheck(4);
  }
  const clickRecieved = () =>{
    // console.log('recieved')
    setCheck(5);
  }
  const blockFriend = () => {
    setCheck(6);
  }

  return (
    <div className='bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen ' >
      <div className='flex flex-col container mx-auto h-screen min-h-[1100px] py-2 gap-3  '>
      {/* {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModal} title={name} msg={mms} color="bg-white"/>} */}
      <div className=' h-1/2 flex md:space-x-2'>
        <div className="hidden md:flex md:flex-col min-w-[130px]  md:w-[15%]  bg-gray-200 shadow-2xl shadow-gray-200  rounded-2xl dark:bg-gray-700 pt-4   ">
                   <div className=" self-center">
                   <FontAwesomeIcon  icon={faTableTennisPaddleBall} flip size="2xl" style={{color:'#0369a1'}}/>                
                   </div>
                   <div className="mt-6">
                    <CallBarLeft page="Profile" />
                   </div>
               </div>
        <div className=' w-[100%] md:w-[85%]  rounded-2xl flex flex-col space-y-2 md:space-y-4'>
          <NavBar page='Dashbord' />
          <div className=' h-[88%] md:h-[86%]  rounded-2xl flex flex-col'>
            <div className='h-1/2 w-full flex justify-center '>
              <Image className='w-full h-full' src={Statics} alt='static' />
            </div>
            <div className='bg-gray-200 w-full  h-1/2 rounded-2xl px-8 md:px-0  overflow-y-auto scrollbar-thin'>
              <div className='h-full  w-full flex  flex-col gap-4 md:flex-row md:justify-around md:items-center'>
                
              <LevelStatics level={context?.level || 0} per={context?.LevlPer || 0} />
              <Stats per={context?.wins || 0} name='Wins' />
              <Stats per={context?.losses || 0} name='Losses' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=' h-1/2 flex flex-col space-y-3 bg-gray-200 rounded-2xl stack '>
        <div className='h-[25%]  flex justify-around items-center  rounded-2xl '>
          <button onClick={clickHistory} className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>History</button>
          <button onClick={clickAchie} className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>Achievement</button>
          <button onClick={clickFriend} className={`font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600`}>Friends</button>
          <div className="dropdown dropdown-end">
          <button tabIndex={0} className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>Requests</button>

                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                    <li><button onClick={clickSent}>Sent</button></li>
                    <li><button onClick={clickRecieved}>Recieved</button></li>
                    <li><button onClick={blockFriend}>Black List</button></li>
                  </ul>
                </div>
          
        </div>
        <div className='h-[75%] w-full shadow-lg bg-gray-100  shadow-slate-600 rounded-2xl overflow-x-auto flex'>
          {DataFunction(check)}
        </div>
      </div>
      </div>
      <RealFooter />
    </div>
  );
}