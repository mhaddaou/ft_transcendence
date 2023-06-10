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
import wait from '../image/wait.json'
// import use





const router = Router;
async function fetchdata(tokene :string ){

    const context = useContext(MyContext);
    var l : string = '';
    if (typeof(tokene) === 'string')
        l = tokene;
    localStorage.setItem('token', tokene);
    
    console.log("the token", tokene);

    context?.setToken(tokene);
    console.log("debug")
    try{
        const res = await axios.get('http://localhost:5000/user/me', {headers:{
            Authorization : `Bearer ${tokene}`
        }})

        const response = await res.data;
        console.log("response " , response);
        context?.setName(response.username);
        context?.setImg(response.avatar);
        context?.setFriends(response.friends);
        context?.setMatch(response.matches);
        // context?.setMatch(response.matches);
        // console.log("here is");
        // console.log(context?.friends[0]);
       
     
      
        router.push('http://localhost:3000/Dashbord');
    }catch(e){
        console.log(e)}
}


export default  function Profileid(){
    const context = useContext(MyContext);
    const router = useRouter();
    var id : string = '';
    if (router.query.id){
        
        id  = router.query.id.toString();
        fetchdata(id);
    }
    
    
    return (
        <div className="min-h-screen w-screen bg-slate-200">
            <div className="container w-screen h-screen flex justify-end items-center">

                <Lottie className="w-full h-full" animationData={wait} />
            </div>


        </div>
    )
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
