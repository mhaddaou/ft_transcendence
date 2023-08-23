import { useRouter } from 'next/router';
import React, { use, useContext, useEffect, useState } from 'react';
import Statics from '../image/statics.svg'
import 'react-circular-progressbar/dist/styles.css';
import LevelStatics, {Stats} from '@/components/Statics'
import RealFooter from '@/components/RealFooter';
import Image from 'next/image';
import NotExist from '../NotExist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import { CallBarLeft} from '@/components/Functions';
import NavBar from '@/components/NavBar';
import { MyContext , ContextTypes} from '@/components/Context';
import Modal from '@/components/Modal';
import axios from 'axios';
import {io} from "socket.io-client";
import createSocketConnection from '@/components/socketConnection'
import { MesgType } from '@/components/Context';
import mhaddaou from '../image/mhaddaou.jpg'
import Sky from '../../image/sky.png'
import avatar from '../../image/avatar.jpg'
import GetDataHistory ,{GetDataAchievement} from '@/components/GetData';
import Router from 'next/router';
const router = Router;




const GetAvatar = ({name} : {name : string}) =>{
    if (name === '0')
      return <Image className=' w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-lg md:rounded-xl ' src={avatar} alt='ava' />
  else
    return <img className=' w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-lg md:rounded-xl ' src={name} alt='ava'/>

}


const Other = () =>{
  const [checkis , setCheckIs] = useState(false);
  const context = useContext(MyContext)
  const [user, setUser] = useState<string>('');
  const userLogin = useRouter()?.query?.id;
  useEffect(()=>{
    const getData = async () =>{
      const getUser = async () =>{
        if (userLogin){
          try{
              if (context?.token && userLogin)
                {const res = await axios.post(`${process.env.FindProfile}`,
                {login : userLogin},{
                  headers:{
                    Authorization: `Bearer ${context?.token}`
                  }
                }
                )
                setUser(res.data.login);}
              
        
              }catch(e){
                setUser('none')
          }
        }
    
      }
      getUser();

      try{
        if (context?.token && userLogin)
        {
          const res = await axios.post(`${process.env.ViewProfile}`, 
        {login : userLogin}, 
        {
          headers: {
            Authorization : `Bearer ${context?.token} `
  
          }
        });
        if (res.data.message){
          setUser('is')
          setCheckIs(true);
        }
        else{
          setUser('none')
        }}
      }catch(e){
      }
    }
    getData();
  }, [userLogin]);
  


  const [check, setCheck] = useState(0);
  const [status , setStatus] = useState('');
  const [level,setLevel] = useState(0);
  const [perLevel,setPerLevel] = useState(0);

  const GetData = (check : number) =>{
    if (check === 1){
      if (context?.profile?.matches)
        return (<GetDataHistory matches={context?.profile?.matches} />);
    }
    if (check === 2){
      if (context?.profile?.acheivement)
        return (<GetDataAchievement achiev={context?.profile?.acheivement} />);
      
    }
    else
      return <div></div>
  }



    useEffect(() =>{
      const fetchData = async  () =>{
        try{
          if (context?.token && context.profileuser)
          {const res = await axios.post(`${process.env.Pprofile}`,{
            login: context?.profileuser
          },
          {
            headers:{
              Authorization : `Bearer ${context?.token}`
            }
          })
          // context?.setProfileuser(JSON.stringify(userLogin));
          if (res.data.inGame)
            setStatus('in Game');
          else{
            if (res.data.isOnline)
              setStatus('En ligne')
            else
              setStatus('Offline');
          }
          const m : string = res.data.lvl.toString();
          setLevel((+m.substring(0,1)))
          setPerLevel((+(m.substring(2.1))) * 10)
          // here when i check level 
          context?.setProfile(res.data);
          return res.data;}
        }catch(e){
        }
      }
        fetchData();
    },[context?.token])

const clickHistory = ()=>{
  setCheck(1);
}
       
const clickAchievement = ()=>{
  setCheck(2);
}

if (context?.profile && checkis ){
  
  return(
      <div className='bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen ' >
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
          
        <div className="h-1/2 w-full relative">
    <div className="h-full w-full rounded-2xl overflow-hidden">
      <div className="h-full w-full bg-cover rounded-2xl">
        <Image
        className='rounded-2xl'
          src={Sky}
          alt="Sky"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center md:justify-start pl-6 gap-8">
        <div>
        <GetAvatar name={context?.profile?.avatar} />
        </div>
        <div className='flex flex-col md:flex-row  justify-between space-y-10 md:space-y-0 md:gap-40  items-center '>
          <div>
            <h1 className="text-4xl text-slate-300 font-mono font-semibold "> {context.profile.username}</h1>

          </div>
          <div>
              <h1 className="text-4xl text-slate-300 font-mono font-semibold  text-center  "> {status}</h1>

          </div>

        </div>
          
      </div>
    </div>
  </div>
          <div className='bg-gray-200 w-full  h-1/2 rounded-2xl px-8 md:px-0  overflow-y-auto scrollbar-thin'>
            <div className='h-full  w-full flex  flex-col gap-4 md:flex-row md:justify-around md:items-center'>
              
            <LevelStatics level={level || 0} per={perLevel || 0} />
            <Stats per={context.profile.porcentages.pWin || 0} name='Wins' />
            <Stats per={context?.profile.porcentages.pLose || 0} name='Losses' />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className=' h-1/2 flex flex-col space-y-3 bg-gray-200 rounded-2xl stack '>
      <div className='h-[25%]  flex justify-around items-center  rounded-2xl '>
        <button onClick={clickHistory} className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>History</button>
        <button onClick={clickAchievement}  className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>Achievement</button>
       
        
        
      </div>
      <div className='h-[75%] w-full shadow-lg bg-gray-100  shadow-slate-600 rounded-2xl overflow-x-auto flex'>
        {GetData(check)}
      </div>
    </div>
    </div>
    <RealFooter />
  </div>

  );
}
if (user === 'none')
  return <NotExist />

else{
  return (
    <div></div>
  )
}

 

}

export default Other;
