import React, { useState } from 'react';
import Search from '@/components/Search';
import Avatar from '@/components/Avatar';
import First from '../image/first.png'
import Statics from '../image/statics.svg'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import LevelStatics, {Stats} from '@/components/Statics'


import Image from 'next/image';
import Link from 'next/link';
import BarLeft from '@/components/BarLeft';
import User from '../image/user.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import Footer from '@/components/Footer';
import Profile from '@/components/Profile';
import Router from 'next/router';
import axios from 'axios';
import GetDataHistory, {GetDataAchievement, GetDataFriend} from '@/components/GetData';
import {DataFunction, CallBarLeft} from '@/components/Functions';



export default function Progress() {
  // const [border, setBorder]
  const[check, setCheck] = useState(0);
  const [msg, setMsg] = useState("");
  const clickHistory = () => {
    setCheck(1);
  }
  const clickAchie = () => {
    setCheck(2);

  }
  const clickFriend = () => {
    setCheck(3);
  }






  return (
    <div className='bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen ' >
      <div className='flex flex-col container mx-auto h-screen py-2 space-y-2 md:space-y-3  '>
      <div className=' h-1/2 flex md:space-x-2'>
        <div className="hidden md:flex md:flex-col  md:w-[15%]  bg-gray-200 shadow-2xl shadow-gray-200  rounded-2xl dark:bg-gray-700 pt-4   ">
                   
                   <div className=" self-center">
                   <FontAwesomeIcon  icon={faTableTennisPaddleBall} flip={true} size="2xl" style={{color:'#0369a1'}}/>                
                   </div>
                   <div className="mt-6">
                    <Profile />
                    <CallBarLeft />
                       
                   </div>
               </div>
        <div className=' w-[100%] md:w-[85%]  rounded-2xl flex flex-col space-y-2 md:space-y-4'>
          <div className='bg-gray-200 h-[12%] rounded-2xl flex items-center px-2 md:px-6 justify-between'>
            <div className='w-[50%] md:w-full'>

          <Search />
            </div>
                
                <Avatar check={true} />
          </div>
          <div className=' h-[88%]  rounded-2xl flex flex-col'>
            <div className='h-1/2 w-full flex justify-center '>
              <Image className='w-full h-full' src={Statics} alt='static' />
            </div>
            <div className='bg-gray-200  h-1/2 rounded-2xl flex  items-center flex-row justify-around'>
              <LevelStatics level={4} per={60} />
              <Stats per={88} name='Wins' />
              <Stats per={12} name='Losses' />

            </div>
          </div>
        </div>
      </div>
      <div className=' h-1/2 flex flex-col space-y-3 bg-gray-200 rounded-2xl stack'>
        <div className='h-[25%]  flex justify-around items-center  rounded-2xl '>
          <button onClick={clickHistory} className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>History</button>
          <button onClick={clickAchie} className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>Achievement</button>
          <button onClick={clickFriend} className={`font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600`}>Friends</button>

        </div>
        
        <div className='h-[75%] w-full shadow-lg bg-gray-100  shadow-slate-600 rounded-2xl overflow-x-auto flex'>
        
          {DataFunction(check)}
        </div>
      </div>
      </div>
      <footer>
          <div className=' h-full flex justify-center items-center  '>
            <Image src={First} alt='logo' />
          </div>
          <div className='py-8 bg-slate-200 shadow-2xl shadow-black '>

            <Footer />
          </div>
          

        </footer>

    </div>
  );
}