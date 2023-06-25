import axios from "axios";
import { useRouter } from "next/router";
import Profile from "./Profile";
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
// import use



class User{

}

const router = Router;
async function fetchdata(tokene :string){

    var l : string = '';
    if (typeof(tokene) === 'string')
        l = tokene;
    localStorage.setItem('token', tokene);
    try{
        const res = await axios.get('http://localhost:5000/user/me', {headers:{
            Authorization : `Bearer ${tokene}`
        }})

        const response = await res.data;
        console.log('res ', response);
        
        
        return response;      
    }catch(e){
        console.log(e)}
}


export default function Profileid() {
    const context = useContext(MyContext);
    const router = useRouter();
  
    useEffect(() => {
      const fetchTokenAndConnectSocket = async () => {
        if (router.query.id) {
          const token = router.query.id.toString();
  
          // Create the socket connection with the token
        //   const socket = createSocketConnection(token);
  
          // Connect the socket
        //   socket.connect();
        //   context?.setSocket(socket);
  
          // Store the socket in your context or use it as needed
          // For example, if you have a socket value in your context
          // you can set it here
          // setSocket(socket);
  
          // Perform other operations with the socket as needed
        //   socket.on('message', (data) => {
        //     console.log('Received message:', data);
        //   });
  
          // Fetch data using the id
          const response = await fetchdata(token);
          console.log("2f response is ", response.enableTwoFa)
          console.log('this is response ', response);
          context?.setToken(token);
          context?.setName(response.username);
        context?.setImg(response.avatar);
        context?.setFriends(response.friends.friends);
        context?.setWaitToAccept(response.friends.pendingInvitation);
        context?.setPendingInvitation(response.friends.waitToAccept);
        context?.setEnableTwofa(response.enableTwoFa)
        context?.setLogin(response.login);
        console.log('this is friends ' , context?.friends);
        console.log('this is pending ', context?.pendingInvitation)
        console.log('this is wating to accept ', context?.waitToAccept);

        context?.setMatch(response.matches);
        console.log("well the 2f is actually", context?.enableTwoFa)
        if (response.enableTwoFa)
        router.push('http://localhost:3000/QrCode');
      else
        router.push('http://localhost:3000/Dashbord');
        // response.enableTwoFa
        }
      };
  
       fetchTokenAndConnectSocket();


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
