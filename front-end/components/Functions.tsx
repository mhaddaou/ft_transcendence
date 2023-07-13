import GetDataHistory, {GetDataAchievement, GetDataFriend, DatSend, DataRecieved, BlackList, LeaderBord} from '@/components/GetData';
import BarLeft from './BarLeft';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from './Context';
import avatar from '../image/avatar.webp'
import Image from 'next/image';
import axios from 'axios';
import Router from 'next/router';
import { Content } from 'next/font/google';
const router = Router

interface PropsCallBarLeft{
  page : string;
}

export default function  Functions(){

}
export const GetAvatar = ({avat } : {avat : string | undefined}) =>{
  if (avat === '0')
    return (
      <Image src={avatar} alt="ava" />
    );
  else
      return (
        <img src={avat} alt="ava" />
      );
}



export function DataFunction (nbr : number){
  const context  = useContext(MyContext);
    return (
        (()=>{
            if (nbr == 1){
              if (context?.match)
              return <GetDataHistory matches={context?.match} />;
            }
            else if (nbr == 2 && context?.acheivement){
              return <GetDataAchievement achiev={context?.acheivement} />
            }
            else if (nbr == 3){

              return <GetDataFriend />
            }
            else if (nbr == 4){
              return <DatSend />
            }
            else if (nbr == 5){
              return <DataRecieved />
            }
            else if (nbr == 6){
              const fetchBlockusers = async () =>{
                try{
                  const res = await axios.post('http://localhost:5000/user/blocks',
                  {
                    login : context?.login
                  },{
                    headers : {
                      Authorization : `Bearer ${context?.token}`
                    }
                  }
                  )
                  console.log(' this is all users you are block ', res.data);
                  context?.setUserBlocked(res.data);
                  console.log('and this is all users you are blocked in context ', context?.userBlocked);
          
                }catch(e){
                  console.log(e)
                }
          
               }
               fetchBlockusers();
              return <BlackList />
            }
            else if (nbr == 7){
              const fetchLeaderBoard = async () =>{
                const res = await axios.get('http://localhost:5000/user/Leaderboard',{
                  headers:{
                    Authorization: `Bearer ${context?.token}`
                  }
                })
                context?.setLeaderBoard(res.data);
              }
              fetchLeaderBoard();
              return <LeaderBord />
            }
            else{
              return <div></div>
            }
          })()
    )
}

export function CallBarLeft(props: PropsCallBarLeft){
    return (
        <>
            <BarLeft name="Profile" check={false} page={props.page}  />
            <BarLeft name="Chat" check={false} page={props.page}  /> 
            <BarLeft name="Game" check={false}  page={props.page}/>
            <BarLeft name="Setting" check={false} page={props.page}/>
            <BarLeft name="Logout" check={false} page={props.page}/> 
        </>
    );

}

export function  GetAvatarChannel (){
  const context = useContext(MyContext);
  // useEffect (() =>{
  //   const GetData =  async () => {
  //     try{
  //       const res = await axios.post(
  //         'http://localhost:5000/chat/channel/message/all',
  //         {channelName: context?.channelInfo?.channelName}, 
  //         {
  //           headers:{
  //             Authorization : `Bearer ${context?.token}`,
  //           },
  //         }
  //       );
  //       context?.setChannelInfo(res.data[0]);
  //     }catch(e){
  //       console.log(e);
  //     }
  //     }
  
  //   GetData();
    
  // },[context?.channelInfo?.avatar])
  

  if (context?.channelInfo?.avatar === '0')
  return (
    <Image className="w-12 h-12 rounded-full border-4 border-slate-400 cursor-pointer hover:border-slate-900" src={avatar} alt="ava" />
  );
else
  return (
    <img className="w-12 h-12 rounded-full border-4 border-slate-400 cursor-pointer hover:border-slate-900" src={context?.channelInfo?.avatar} alt="ava" />
  );


}

export async function  checkIs7rag(token : string) {
  try{
    const res = await axios.get('http://localhost:5000/user/is7erag', {headers:{
            Authorization : `Bearer ${token}`
        }})
        if (res.data.message)
          console.log('is not 7rag');
        else{
          console.log('is 7rag 7rag');
          router.push('/NotExist');
        }

  }catch(e){
    console.log(e);
  }


}

