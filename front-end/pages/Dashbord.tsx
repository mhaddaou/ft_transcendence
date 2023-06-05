import React, { useContext, useState } from 'react';
import Statics from '../image/statics.svg'
import 'react-circular-progressbar/dist/styles.css';
import LevelStatics, {Stats} from '@/components/Statics'
import RealFooter from '@/components/RealFooter';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import {DataFunction, CallBarLeft} from '@/components/Functions';
import NavBar from '@/components/NavBar';
import { MyContext } from '@/components/Context';



export default function Progress() {

  const context = useContext(MyContext);


  // const {name = UseMyContext();
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
      <div className='flex flex-col container mx-auto h-screen min-h-[1100px] py-2 gap-3  '>
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
          <div className=' h-[88%]  rounded-2xl flex flex-col'>
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