import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";
import setting2 from '../../image/setting2.svg'
import Lottie from "lottie-react";
import Anim from '../../image/paramanimation.json'
import Image from "next/image";
import { UpdateName, UpdateAvatar, Twofactor } from "@/components/Updates";
import RealFooter from "@/components/RealFooter";
import { MyContext } from "@/components/Context";
import { useContext, useEffect } from "react";
import {io} from "socket.io-client"
import InfoContact from "@/components/InfoContact";
import createSocketConnection from "@/components/socketConnection";






  const Setting = () =>{
    const context = useContext(MyContext);
    var token : string | null = '';
    useEffect(() =>{
      context?.setSocket(createSocketConnection(context?.token))
    },[context?.token])
    
    if (context?.socket)
    context?.socket.on('message',(paylo) =>{
      console.log(paylo);
    })
    


    return (
        <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
            <div className="container mx-auto h-screen min-h-[1024px] flex flex-col py-2 gap-2">
                <div className="w-full h-[35%]   flex rounded-2xl gap-2">
                        <Barl page="Setting"/>
                    <div className="w-full  flex flex-col gap-2">
                            <NavBar page="Setting" />
                        <div className="h-[88%] bg-slate-300 md:bg-inherit rounded-2xl flex justify-center items-center">
                        {/* <Image className="w-full h-full" src={setting2} alt="setting2"/> */}
                        <Lottie className="w-full h-full" animationData={Anim} />

                        </div>
                    </div>
                </div>
                <div className="w-full h-[67%] rounded-2xl bg-gray-300 flex flex-col gap-2 px-4">
                {/* <InfoContact /> */}
                
                    <UpdateName />
                    <UpdateAvatar />
                    <Twofactor />
                </div>
            </div>
           <RealFooter />
        </div>
    );
}

export default Setting;
