import axios from "axios";
import { useRouter } from "next/router";
import Router from "next/router";
import { MyContext } from "@/components/Context";
import { useContext, useEffect } from "react";
import Lottie from "lottie-react";
import wait from '../../image/wait.json'
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
        const res = await axios.get(`${process.env.ME}`, {headers:{
            Authorization : `Bearer ${tokene}`
        }})

        const response = await res.data;
        
        
        return response;      
    }catch(e){}
}


export default function Profileid() {
    const context = useContext(MyContext);
    const router = useRouter();
  
    useEffect(() => {
      const fetchTokenAndConnectSocket = async () => {
        if (router.query.id) {
          const token = router.query.id.toString();
          const response = await fetchdata(token);
          context?.setToken(token);
          context?.setName(response.username);
        context?.setImg(response.avatar);
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
