import axios from "axios";
import { useRouter } from "next/router";
import Profile from "./Profile";
import Router from "next/router";
import { MyContext } from "@/components/Context";
import { useContext } from "react";
import { string } from "prop-types";
import { match } from "assert";
const router = Router;
async function fetchdata(token :string | string[] | undefined){
    const context = useContext(MyContext);
    console.log("the token", token);
    console.log("debug")
    try{
        const res = await axios.get('http://localhost:5000/user/me', {headers:{
            Authorization : `Bearer ${token}`
        }})
        const response = await res.data;
        context?.setName(response.username);
        context?.setImg(response.avatar);
        context?.setFriends(response.friends);
        context?.setMatch(response.matches);
        console.log("here is");
        console.log(context?.friends[0]);
      
        router.push('http://localhost:3000/Dashbord');
    }catch(e){
        console.log(e)}
}


export default function Profileid(){
    const router = useRouter();
    const id = router.query.id ?? null;
    if (id)
    var res = fetchdata(id);
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
