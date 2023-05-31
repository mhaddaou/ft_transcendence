import { faTableTennisPaddleBall } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Profile from "./Profile";
import { CallBarLeft } from "./Functions";
interface PropsBarl{
    page : string;
}


const Barl = (props : PropsBarl) =>{
    return (
        <div className={`${props.page === 'Chat'? 'block' : 'hidden'} md:flex md:flex-col min-w-[130px]  md:w-[15%]  bg-gray-200 shadow-2xl shadow-gray-200  rounded-2xl dark:bg-gray-700 pt-4 `}>
        <div className=" self-center">
        <FontAwesomeIcon  icon={faTableTennisPaddleBall} flip={true} size="2xl" style={{color:'#0369a1'}}/>                
        </div>
        <div className="mt-6">
         {/* <Profile /> */}
         <CallBarLeft page={props.page} />
        </div>
        </div>
    );
}


export default Barl;