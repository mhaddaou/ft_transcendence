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
    const res = await axios.get('http://localhost:5000/user/is7erag', {headers:{
            Authorization : `Bearer ${token}`
        }})
       return res.data.message;
}

const router = Router;
async function fetchdata(tokene :string){
    localStorage.setItem('token', tokene);
    try{
        const res = await axios.get('http://localhost:5000/user/me', {headers:{
            Authorization : `Bearer ${tokene}`
        }})

        const response = await res.data;
        console.log('this is me res ', response);
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

          if (!checkIsFalse(router.query.id.toString()))
            console.log('ah rah false')
          else
            console.log('not false');
          const token = router.query.id.toString();
  
          // checkIsFalse(token) ? console.log('true') : console.log(false) 
          console.log ('this is check false ', checkIsFalse(token))
          const response = await fetchdata(token);
          if (!response)
            return ;
          // console.log("2f response is ", response.enableTwoFa)
        console.log('this is response for for for ', response);
        context?.setToken(token);
        context?.setName(response.username);
        console.log('this is level ', response.lvl);
        console.log('this is wins ', response.porcentages.pLose)
        console.log('this is los ', response.porcentages.pWin)
        
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
        console.log('this is friends ' , context?.friends);
        console.log('this is pending ', context?.pendingInvitation)
        console.log('this is wating to accept ', context?.waitToAccept);

        context?.setMatch(response.matches);
        console.log('this is matches ', response.matches);
        console.log("well the 2f is actually", context?.enableTwoFa)
        if (response.enableTwoFa)
        router.push('http://localhost:3000/QrCode');
      else
        router.push('http://localhost:3000/Dashbord');
        // response.enableTwoFa
        }
      };
  
       fetchTokenAndConnectSocket();
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


    }, [router.query.id]);
  
    return (
      <div className="min-h-screen w-screen bg-slate-200">
        <div className="container w-screen h-screen flex justify-end items-center">
          <Lottie className="w-full h-full" animationData={wait} />
        </div>
      </div>
    );
  }
  


// {
//     UserId: '65eabf7b-3176-4ac5-a594-8856f68db353',
//     login: 'smia',
//     username: 'said lbatal',
//     email: 'smia@student.1337.ma',
//     avatar: '0',
//     enableTwoFa: true,
//     twoFactorSecret: null,
//     bioGra: ''
//   }

// {
//   "FriendshipId": "2c0a1d9f-d58f-43fb-81ed-74b72142598b",
//   "userAId": "c643911e-fc8d-4e4b-b39b-6b18ce82db06",
//   "loginA": "mhaddaou",
//   "userBId": "4d750f18-2b0a-4906-aa40-689960b552cf",
//   "loginB": "izail",
//   "isFriends": false
// }
