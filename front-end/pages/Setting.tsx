import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";
import setting2 from '../image/setting2.svg'
import Lottie from "lottie-react";
import Anim from '../image/paramanimation.json'
import Image from "next/image";
import { UpdateName, UpdateAvatar, Twofactor } from "@/components/Updates";
import RealFooter from "@/components/RealFooter";
import { MyContext } from "@/components/Context";
import { useContext, useEffect } from "react";
import {io} from "socket.io-client"
import InfoContact from "@/components/InfoContact";




  const Setting = () =>{
    const context = useContext(MyContext);
    var token : string | null = '';
    useEffect(() => {
        if (context?.token){
            var socket = io("http://localhost:3333", {
              extraHeaders: {
                  Authorization: context?.token,
          }
          });
          socket.on('message', (payload: any) => {
            console.log("111111111111111");
            console.log(`Received message: ${payload}`);
            // SetToMessages(payload);
            // setMessages([...messages, payload]);
          });
          socket.on('errorMessage', (payload: any) => {
            console.log("111111111111111");
    
            console.log(`Received message: ${payload}`);
            // SetToMessages(payload);
            // setMessages([...messages, payload]);
          });
          context.setSocket(socket);

        }
      }, [context?.token]);
    


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
