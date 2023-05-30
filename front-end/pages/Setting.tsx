import HBest from "@/components/HBest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile from '@/components/Profile';
import { CallBarLeft } from "@/components/Functions";
import { faTableTennisPaddleBall } from "@fortawesome/free-solid-svg-icons";
import Barl from "@/components/Barl";

const Setting = () =>{
    return (
        <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
            <div className="container mx-auto h-screen flex flex-col py-2">
                <div className="w-full h-[40%] flex bg-blue-400">
                    <Barl page="Setting" />
                    
                    <div>bar top</div>
                </div>
                <div className="w-full h-[60%] bg-slate-500"></div>
            </div>

        </div>
    );
}

export default Setting;
