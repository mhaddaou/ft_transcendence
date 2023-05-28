import React, { useState } from 'react';
import Search from '@/components/Search';
import Avatar from '@/components/Avatar';
import First from '../image/first.png'

import Image from 'next/image';
import Link from 'next/link';
import BarLeft from '@/components/BarLeft';
import User from '../image/user.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import Footer from '@/components/Footer';


export default function Progress() {
  const[check, setCheck] = useState(0);
  const [msg, setMsg] = useState("");
  const clickHistory = () => {
    setMsg("Not have history yet");
  }
  const retMsg =() =><p className=' text-4xl mx-auto my-auto text-white font-semibold font-mono'>{msg}</p>
  const clickAchie = () => {
    setMsg("not have any achievement yet");
  }
  const clickFriend = () => {
    setMsg("not have any frinds yet");
  }
  return (
    <div className='bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen'>
      <div className='flex flex-col container mx-auto h-screen py-2 md:space-y-3'>
      <div className=' h-1/2 flex space-x-2'>
        <div className="hidden md:flex md:flex-col w-[15%] bg-gray-200 shadow-2xl shadow-gray-200  rounded-2xl dark:bg-gray-700 pt-4   ">
                   
                   <div className=" self-center">
                   <FontAwesomeIcon  icon={faTableTennisPaddleBall} flip size="2xl" style={{color:'#0369a1'}}/>                
                   </div>
                   <div className="mt-6">
                   <Link className="flex items-center justify-start w-full p-4 my-2 font-thin text-blue-500 uppercase transition-colors duration-200 border-r-4 border-blue-500 bg-gradient-to-r from-white to-blue-100 dark:from-gray-700 dark:to-gray-800" href="#">
                           <span className="text-left">
                               <Image className="w-8 " alt="user" src={User} />
                           </span>
                           <span className="mx-4 text-sm font-normal self-end">
                               Profile
                           </span>
                       </Link>
                       <BarLeft name="Chat" check={false} />
                       <BarLeft name="Game" check={false} />
                       <BarLeft name="Setting" check={false} />
                       
                       
                       

                   </div>
               </div>
        <div className=' w-full md:w-[85%]  rounded-2xl flex flex-col space-y-2 md:space-y-4'>
          <div className='bg-gray-200 h-[12%] rounded-2xl flex items-center px-2 md:px-6 justify-between'>
            <div className='w-[50%] md:w-full'>

          <Search />
            </div>
                
                <Avatar check={true} />
          </div>
          <div className='bg-gray-200 h-[88%] rounded-2xl'></div>
        </div>
      </div>
      <div className=' h-1/2 flex flex-col space-y-3'>
        <div className='h-[25%]  flex justify-around items-center  rounded-2xl'>
          <button onClick={clickHistory} className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>History</button>
          <button onClick={clickAchie} className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>Achievement</button>
          <button onClick={clickFriend} className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>Friends</button>

        </div>
        <div className='h-[75%] shadow-lg bg-slate-500 shadow-slate-600 rounded-2xl flex'>
          {
            (()=>{
              if (check == 0){
                return (retMsg());
              }
            })()
          }
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