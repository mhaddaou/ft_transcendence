import { useRouter } from "next/router";
import Progress from "@/components/Dashbord";
import NotExist from "@/components/NotExist";
import Home from './index'
import { MyContext } from "@/components/Context";
import { useContext } from "react";
import Router from "next/router";
import Chat from '@/components/Chat'
import Setting from "@/components/Setting";
import Game from '@/components/Game'
const router = Router;

export default function setIt  () {
    const context = useContext(MyContext);
    const page = useRouter()?.query?.id;
    if (page){
        // if (!context?.token)
        //     return <Home/>
        if (page === "Dashbord"){
            return <Progress />
        }
        if (page === "Setting")
            return <Setting />
        if (page === "Chat")
            return <Chat />
        if (page === "Game")
            return <Game />
    }
    else
        return <NotExist />

}