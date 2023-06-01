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
import  {InputMsg2} from "@/components/FormName";
import Link from "next/link";
import { useState } from "react";
import Messages from "@/components/Messages";
import Info from "@/components/Info";

const NewChat = () =>{
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
                            <NewContactList />
                            
                        </div>
                        <div className="hidden md:flex bg-gradient-to-r from-gray-200 via-slate-300 to-slate-400 w-2/3 rounded-2xl md:flex-col">
                            <div className="w-full rounded-2xl  h-[5%] flex items-center justify-around ">
                                <div className="w-1/2 h-full flex items-center pl-8 gap-6">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <Image src={mhaddaou} alt="av" />
                                        </div>
                                    </div>
                                    <div className="font-mono font-extrabold">mhaddaou</div>
                                </div>
                                <div className=" w-1/2 h-full flex flex-col items-end justify-center pr-8 ">
                                    <button onClick={clickPro} className="relative">
                                        <FontAwesomeIcon icon={faBars} flip style={{color: "#f0f2f5",}} />
                                        <ul className={`${hidden} bg-white absolute -left-24 z-20 rounded-lg y-2 text-sm text-gray-700 dark:text-gray-400 flex flex-col font-mono font-semibold`} aria-labelledby="dropdownLargeButton">
                                            <li>
                                                <Link href="#" className=" hover:text-cyan-700 pl- text-left  rounded-t-lg block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">info</Link>
                                            </li>
                                            <li>
                                                <Link href="#" className=" hover:text-cyan-700 text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">block</Link>
                                            </li>
                                            <li>
                                                <Link href="#" className="hover:text-cyan-700 text-left rounded-b-lg block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</Link>
                                            </li>
                                        </ul>
                                    </button>
                                    
                                </div>

                            </div>
                            <div className="w-full h-full hidden">
                                <Info />

                            </div>
                            <div className="w-full h-full hidde">
                                <Messages />
                                <InputMsg2 />
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <RealFooter />
        </div>
    );
   

}

export default NewChat;