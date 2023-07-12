import React, { use, useContext, useEffect, useState } from 'react';
import Statics from '../image/statics.svg'
import 'react-circular-progressbar/dist/styles.css';
import LevelStatics, {Stats} from '@/components/Statics'
import RealFooter from '@/components/RealFooter';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import {DataFunction, CallBarLeft} from '@/components/Functions';
import NavBar from '@/components/NavBar';
import { MyContext , ContextTypes, FriendType} from '@/components/Context';
import Modal, { ModalError, ModalInvite } from '@/components/Modal';
import axios from 'axios';
import {io} from "socket.io-client";
import createSocketConnection from '@/components/socketConnection'
import { useRouter } from 'next/router';
import { MesgType } from '@/components/Context';
import { Sleeping } from 'matter-js';
import { Socket } from 'dgram';
// import { initSocketConnection, getSocket } from '@/components/socketConnection';

var i = 0;
var token : string | null = null;


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
     token = localStorage.getItem('token');
    // console.log(context?.login, ' this is login in useEffect');
    token ? router.push('/Dashbord') : router.push('/')
  },[])

  useEffect(() =>{
    context?.setSocket(createSocketConnection(context?.token))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[context?.token])
  

  const openModal = () => {
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

  
  const [user, SetUser] = useState<FriendType>()
     


  const [isPageReloaded, setIsPageReloaded] = useState(false);

  useEffect(() => {
    if (window.performance && window.performance.navigation.type === 1) {
      setIsPageReloaded(true);
      console.log("is refreching")
    }
  }, []);


  


      

  
  


  const[check, setCheck] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() =>{
    if (context?.socket)
    context.socket.on('gameInvitation', (payload: any) => {
        
     
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
  const clickLeaderboard = () => {
    setCheck(7);
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
  if (token){

    return (
      <div className='bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen ' >
        <ModalError />
        <div className='flex flex-col container mx-auto h-screen min-h-[1100px] py-2 gap-3  '>
        {/* {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModal} title={name} msg={mms} color="bg-white"/>} */}
        <div className=' h-1/2 flex md:space-x-2'>
          <div className="hidden md:flex md:flex-col min-w-[130px]  md:w-[15%]  bg-gray-200 shadow-2xl shadow-gray-200  rounded-2xl  pt-4   ">
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
            <button onClick={clickLeaderboard} className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>LeaderBord</button>
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
}