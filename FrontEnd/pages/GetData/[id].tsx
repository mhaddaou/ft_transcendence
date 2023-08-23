import axios from "axios";
import { useRouter } from "next/router";
// import Profile from "../../mmprofile";
import Router from "next/router";
import { MyContext } from "@/components/Context";
import { useContext, useEffect } from "react";
import { string } from "prop-types";
import { match } from "assert";
import {io} from "socket.io-client"
import { type } from "os";
import { Socket } from "dgram";
import Lottie from "lottie-react";
import wait from '../../image/wait.json'
import createSocketConnection from '@/components/socketConnection'
import { checkIs7rag } from "@/components/Functions";
// import use



export async function  checkIsFalse(token : string) {
  try{
    const res = await axios.get(`${process.env.is7rag}`, {headers:{
            Authorization : `Bearer ${token}`
        }})
      
       return res.data.message;
  }catch(e){}
}

const router = Router;
async function fetchdata(tokene :string){
    localStorage.setItem('token', tokene);
    try{
        const res = await axios.get(`${process.env.ME}`, {headers:{
            Authorization : `Bearer ${tokene}`
        }})

        const response = await res.data;
          return response
    }catch(e){
        router.push('/NotExist')}
}



export default function Profileid() {
    const context = useContext(MyContext);
    const router = useRouter();
  
    useEffect(() => {
      const fetchTokenAndConnectSocket = async () => {
        if (router.query.id) {
          const token = router.query.id.toString();
  
          const response = await fetchdata(token);
          if (!response)
            return ;  
        context?.setToken(token);
        context?.setName(response.username);
        
        context?.setLevel(response.lvl.toFixed(0));
        const m : string = response.lvl.toString();
          context?.setLevel((+m.substring(0,1)))
          context?.setLevlPer((+(m.substring(2.1))) * 10)
        context?.setLosses(response.porcentages.pLose)
        context?.setWins(response.porcentages.pWin)
        context?.setImg(response.avatar);
        context?.setAcheivement(response.acheivement);
        context?.setFriends(response.friends.friends);
        context?.setWaitToAccept(response.friends.pendingInvitation);
        context?.setPendingInvitation(response.friends.waitToAccept);
        context?.setEnableTwofa(response.enableTwoFa)
        context?.setLogin(response.login);

        context?.setMatch(response.matches);
        if (response.enableTwoFa)
        router.push(`${process.env.Qrcode}`);
      else
        router.push(`${process.env.Dashbord}`);
        // response.enableTwoFa
        }
      };
  
       fetchTokenAndConnectSocket();
       const fetchBlockusers = async () =>{
        if (context?.login){
          try{
            const res = await axios.post(`${process.env.Blocks}`,
            {
              login : context?.login
            },{
              headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
              }
            }
            )
            context?.setUserBlocked(res.data);
            const lead = await axios.get(`${process.env.Leaderboard}`,{
              headers:{
                Authorization: `Bearer ${context?.token}`
              }
            })
            context?.setLeaderBoard(lead.data);
          }catch(e){
          }
        }

       }
       fetchBlockusers();


    }, [router.query.id]);
  
    return (
      <div className="min-h-screen w-screen bg-slate-200">
        <div className="container w-screen h-screen flex justify-end items-center">
          <Lottie className="w-full h-full" animationData={wait} />
        </div>
      </div>
    );
  }
  


