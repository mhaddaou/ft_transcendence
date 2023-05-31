import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";
import NewContactList from "@/components/NewContactList";
import RealFooter from "@/components/RealFooter";
import mhaddaou from '../image/mhaddaou.jpg'
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const NewChat = () =>{
    return (
        <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
            <div className="container w-full mx-auto h-screen min-h-[1024px] flex flex-row py-2 gap-2">
                <Barl page="Chat"/>
                <div className="w-full h-full rounded-2xl flex flex-col  gap-2 ">
                <NavBar page="Chat"/>
                    <div className="w-full h-[95%] rounded-2xl bg-gray-300 flex gap-1">
                        <div className="w-full md:w-1/3 rounded-2xl  ">
                            <NewContactList />
                            
                        </div>
                        <div className="hidden md:flex bg-gradient-to-r from-gray-300 via-slate-400 to-slate-500 w-2/3 rounded-2xl md:flex-col gap-1">
                            <div className="w-full rounded-2xl  h-[5%] flex items-center justify-around">
                                <div className="w-1/2 h-full flex items-center pl-8 gap-6">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <Image src={mhaddaou} alt="av" />
                                        </div>
                                    </div>
                                    <div className="font-mono font-extrabold">mhaddaou</div>
                                </div>
                                <div className=" w-1/2 h-full flex items-center justify-end pr-8">
                                    <button>
                                        <FontAwesomeIcon icon={faBars} flip style={{color: "#f0f2f5",}} />
                                    </button>
                                </div>

                            </div>
                            <div className="w-full rounded-2xl bg-blue-400 h-[95%]">

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