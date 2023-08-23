import GetDataHistory, {GetDataAchievement, GetDataFriend, DatSend, DataRecieved, BlackList, LeaderBord} from '@/components/GetData';
import BarLeft from './BarLeft';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from './Context';
import avatar from '../image/avatar.jpg'
import Image from 'next/image';
import axios from 'axios';
import Router from 'next/router';
const router = Router

interface PropsCallBarLeft{
  page : string;
}

export default function  Functions(){

}
export const GetAvatar = ({avat } : {avat : string | undefined}) =>{
  if (avat === '0')
    return (
      <Image src={avatar}  alt="ava" />
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
                  const res = await axios.post(`${process.env.Blocks}`,
                  {
                    login : context?.login
                  },{
                    headers : {
                      Authorization : `Bearer ${context?.token}`
                    }
                  }
                  )
                  context?.setUserBlocked(res.data);
          
                }catch(e){
                }
          
               }
               fetchBlockusers();
              return <BlackList />
            }
            else if (nbr == 7){
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
  

  if (context?.channelInfo?.avatar === '0')
  return (
    <Image className="w-12 h-12 rounded-full border-4 border-slate-400 cursor-pointer hover:border-slate-900" src={avatar}  alt="ava" />
  );
else
  return (
    <img className="w-12 h-12 rounded-full border-4 border-slate-400 cursor-pointer hover:border-slate-900" src={context?.channelInfo?.avatar} alt="ava" />
  );


}

export async function  checkIs7rag(token : string) {
  try{
    const res = await axios.get(`${process.env.is7rag}`, {headers:{
            Authorization : `Bearer ${token}`
        }})
        if (!res.data.message)
          router.push('/NotExist');

  }catch(e){
  }


}

