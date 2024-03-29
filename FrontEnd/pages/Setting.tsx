import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";
import Lottie from "lottie-react";
import Anim from '../image/paramanimation.json'
import { UpdateName, UpdateAvatar, Twofactor } from "@/components/Updates";
import RealFooter from "@/components/RealFooter";
import { MyContext } from "@/components/Context";
import { useContext, useEffect } from "react";
import Router from "next/router";
import createSocketConnection from "@/components/socketConnection";
import { ModalError, ModalDeleteAcount, ModalGameInvite,  } from "@/components/Modal";
const router = Router;
var token : string | null = null;






  const Setting = () =>{
    const context = useContext(MyContext);

    useEffect(() =>{
      
      token = localStorage.getItem('token');
      token ? router.push('/Setting') : router.push('/');
    },[])


    useEffect(() =>{
      if (!context?.socket?.connected)
        context?.setSocket(createSocketConnection(context?.token))
    },[context?.token])
    
    if (context?.socket?.connected)
    context?.socket.on('message',(paylo) =>{
    })

    useEffect(() =>{
      if (context?.socket)
      context.socket.on('gameInvitation', (payload: any) => {
          
       
        if (payload && payload.sender) {
          context.setGameInvitation(true)
          context.setGameHost(payload.sender.login)
          context.setGameHostUsername(payload.sender.username)
        }
      });
     
    }, [context?.socket])

    if (token){
      return (
        <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
          <ModalError />
        <ModalGameInvite />

          <div className=" overflow-hidden">

          <ModalDeleteAcount/>
          </div>
            <div className="container mx-auto h-screen min-h-[1024px] flex flex-col py-2 gap-2">
                <div className="w-full h-[35%]   flex rounded-2xl gap-2">
                        <Barl page="Setting"/>
                    <div className="w-full  flex flex-col gap-2">
                            <NavBar page="Setting" />
                        <div className="h-[88%] bg-slate-300 md:bg-inherit rounded-2xl flex justify-center items-center">
                        <Lottie className="w-full h-full" animationData={Anim} />
  
                        </div>
                    </div>
                </div>
                <div className="w-full h-[67%] min-h-[] rounded-2xl bg-gray-300 flex flex-col gap-2 px-4 pb-8">
                {/* <InfoContact /> */}
                
                    <UpdateName />
                    <UpdateAvatar />
                    <Twofactor />
                </div>
            </div>
            <div className="container w-screen h-[200px] mx-auto rounded-2xl bg-gray-300 flex flex-col gap-2 px-4d">
            <div className="h-full w-full  flex flex-col gap-4">
            <div className="h-1/3  py-2">
                <h1 className="h-[70%] font-mono font-semibold pl-4">Deleting your account</h1>
                <hr className="w-[60%] h-[30%] border-t-4"/>
            </div>
            <div className="h-1/3 text-base md:text-lg font-mono pl-2 ">
                <p>"If you no longer wish to use your account on our website, you can delete it at any time. Please </p>
                <p>note that deleting your account will permanently remove all of your data, including your</p>
                <p>profile, messages, and any other content you have uploaded. </p>
                <br></br>
            </div>
            <div className="h-1/3 w-full flex justify-end items-center  pr-4 pb-2 ">
            <button onClick={()=> {
              context?.setDeleteAcount(true)
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
             className="  flex-shrink-0 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                            Delete
                    </button>
            </div>
         </div>

            </div>
           <RealFooter />
        </div>
    );
    }
}

export default Setting;
