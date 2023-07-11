import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Statics from '../image/statics.svg'
import 'react-circular-progressbar/dist/styles.css';
import LevelStatics, {Stats} from '@/components/Statics'
import RealFooter from '@/components/RealFooter';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import {DataFunction, CallBarLeft} from '@/components/Functions';
import NavBar from '@/components/NavBar';
import { MyContext , ContextTypes} from '@/components/Context';
import Modal from '@/components/Modal';
import axios from 'axios';
import {io} from "socket.io-client";
import createSocketConnection from '@/components/socketConnection'
import { MesgType } from '@/components/Context';
import mhaddaou from '../image/mhaddaou.jpg'
import Sky from '../../image/sky.png'
import avatar from '../../image/avatar.webp'
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
  const userLogin = useRouter()?.query?.id;
  useEffect(()=>{
    const getData = async () =>{

      try{
        const res = await axios.post('http://localhost:5000/user/viewProfile', 
        {login : userLogin}, 
        {
          headers: {
            Authorization : `Bearer ${context?.token} `
  
          }
        });
        console.log('this is res profile ', res.data.message);
        if (res.data.message)
          setCheckIs(true);
        else
          router.push('/NotExist');
      }catch(e){
        console.log(e);
      }
    }
    getData();
  }, [userLogin]);
  console.log(userLogin);
  // const [user, setUser] = useState();
  // const getUser = async () =>{
  //   if (userLogin){
  //     try{
  //       const res = await axios.post('http://localhost:5000/user/find',
  //       {login : userLogin},{
  //         headers:{
  //           Authorization: `Bearer ${context?.token}`
  //         }
  //       }
  //       )
  //       console.log('here herkldjfkj ')
  //       console.log(res.data);
  //       setUser(res.data);

  //     }catch(e){
  //       console.log(e);
  //     }
  //   }

  // }
  // getUser();


  const [check, setCheck] = useState(0);
  const [status , setStatus] = useState('');

  const GetData = (check : number) =>{
    console.log(check , '  this is check')
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
          const res = await axios.post('http://localhost:5000/user/profile',{
            login: context?.profileuser
          },
          {
            headers:{
              Authorization : `Bearer ${context?.token}`
            }
          })
          // context?.setProfileuser(JSON.stringify(userLogin));
          console.log("respnse profile  ", res.data);
          if (res.data.inGame)
            setStatus('in Game');
          else{
            if (res.data.isOnline)
              setStatus('En ligne')
            else
              setStatus('Offline');
          }
          console.log('this is all data in profile ', res.data.acheivement);
          context?.setProfile(res.data);
          console.log(res.data.avatar)
          console.log('context ', context?.profile?.avatar);
          return res.data;
        }catch(e){
          console.log(e);
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
}

export default Other;

// const MyScreen = () =>{
//     const page = useRouter()?.query?.id ?? "1";
//     // Default value = "1"

//     return (<>id is: {page}</>);
// }

// export default MyScreen 