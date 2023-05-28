import axios from "axios";
import { useRouter } from "next/router";
import Profile from "./Profile";
import Router from "next/router";
const router = Router;
async function fetchdata(token :string | string[] | undefined){
    console.log("the token", token);
    console.log("debug")
    try{
        const res = await axios.get('http://localhost:5000/user/me', {headers:{
            Authorization : `Bearer ${token}`
        }})
        const response = await res.data;
        console.log(response);
        <Profile response />
        router.push('http://localhost:3000/Profile');
        

            
        
    }catch(e){
        console.log(e)}
}


export default function Profileid(){
    const router = useRouter();
    const id = router.query.id ?? null;
    if (id)
    var res = fetchdata(id);
}
