import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";
import NewContactList from "@/components/NewContactList";
import RealFooter from "@/components/RealFooter";
import mhaddaou from '../image/mhaddaou.jpg'
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { CallBarLeft } from "@/components/Functions";
import smia from '../image/smia.jpg'
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react";
import anim from '../image/chatanim.json'
import ChatConversation from "@/components/ChatConversation";
import { MyContext } from "@/components/Context";
import Info from "@/components/Info";

import Messages from "@/components/Messages";
import  {InputMsg2} from "@/components/FormName";


const NewChat = () =>{
    const context  = useContext(MyContext);


    const [show, setShow] = useState('block');
    console.log(show)

    const click  = () =>{
        if (show === 'block')
            setShow('hidden');
        else
            setShow('block');
        
    }
    const [hidden, setHidden] = useState('hidden');

    const clickPro = () : void =>{
        if (hidden === 'hidden')
            setHidden('block');
        else
            setHidden('hidden');
    }
    
    return (
        <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
            <div className="container w-full mx-auto h-screen min-h-[1024px] flex flex-row py-2 gap-2">
                <Barl page="Chat"/>
                <div className="w-full h-full rounded-2xl flex flex-col  gap-2 ">
                <NavBar page="Chat"/>
                    <div className="w-full h-[95%] rounded-2xl bg-gray-400 flex gap-1">
                        <div className="w-full md:w-1/3 rounded-2xl bg-gray-200 ">
                        <div className="h-full w-full  rounded-2xl flex flex-col gap-1">
                        <div className="h-[5%] rounded-2xl flex justify-center items-center">
                            <p className="font-mono font-bold">Contact List</p>
                        </div>
                        <div className="h-[95%] w-full  rounded-2xl flex flex-col gap-1 px-2 md:px-1 overflow-y-auto scrollbar-none">
                            <button onClick={click}  className="py-2 bg-slate-300 w-full h-16 flex px-4 gap-5  rounded-lg">
                                <div className='w-1/2 h-full flex items-center gap-3'>
                                <div className="avatar">
                                                    <div className="w-10 rounded-full ring ring-green-400 ring-offset-base-100 ring-offset-2">
                                                        <Image src={mhaddaou} alt="av" />
                                                    </div>
                                                </div>
                                    <div className='font-mono font-semibold'>{context?.name}</div>
                                </div>
                                <div className='w-1/2 h-full flex items-center justify-end'>
                                    <div className='w-5 h-5 bg-emerald-600 rounded-full text-xs flex justify-center items-center text-slate-800'>
                                        2
                                    </div>
                                </div>
                            </button>
                        
                            
                        </div>

                    </div>
                            
                        </div>
                        {
                            (() =>{
                                const elements = [];
                                if (show === 'block')
                                    elements.push(<Lottie className={`w-full h-full `}   animationData={anim} />);
                                else
                                    elements.push(<ChatConversation num={1} />);
                                return elements;
                            })()
                        }
                       
                        
                    </div>
                </div>
            </div>
            <RealFooter />
        </div>
    );
   

}

export default NewChat;