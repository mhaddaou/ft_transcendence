import { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import canvas from 'canvas'



import { type } from "os";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




type CircleProps = {
    check : boolean,
}


const Circle = ({check } : CircleProps)  =>{
   const [elem, setElement] = useState("hidden");
   function Hover (){
    setElement("block");
   }
   function Leave (){
    setElement("hidden");
   }
    if (check == true){

        return (
            <div  style={{animationName:'head', animationDuration:'2s'}}
            onMouseEnter={Hover}
            onMouseLeave={Leave}
            className={`bg-cyan-400 p-1 rounded-full w-16 h-16 border-4 border-black  hover:border-red-400 relative z-0`} >
              <button >
                <Image className=" w-14 h-14 z-10 rounded-full relative -top-1  "  
                            alt="av" src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
                            width={1000} height={1000}/>
                    <div className={`absolute flex flex-col py-2 bg-gradient-to-r from-green-400 to-blue-500 mt-2 -left-6 opacity-70 rounded-lg space-x-2 pr-2  z-50 ${elem}`}>
                    <div className=" flex flex-row space-x-1 ml-1">
                    <AccountCircleIcon className="text-white" />
                    <Link href="http://localhost:3000/Profile"  className='  hover:text-white text-red-950 '>
                      <span  className="italic"
                      style={{fontSize:'18px'}}>
                        Profile
                        </span> 
                      </Link>

                    </div>
                    <div className="flex flex-row space-x-1 ml-5 relative -left-1">
                      <SettingsIcon className="text-white" />
                    <Link href="http://localhost:3000/Setting" className="text-red-950 hover:text-white">
                    <span  className="italic"
                      style={{fontSize:'18px'}}>
                        Setting
                        </span> 
                      
                    </Link>
                    </div>
                    <div className="flex flex-row space-x-1 ml-5 relative -left-1">
                      <LogoutIcon className="text-white" />
                    <Link href="http://localhost:3000/" className="text-red-500 hover:text-red-800">
                    <span  className="italic"
                      style={{fontSize:'18px'}}>
                        Log Out
                        </span> 
                      
                    </Link>
                    </div>
                   
                    </div>
              </button>
            </div>
        );
    }
    else{
        return (<div></div>)
    }


}

export default Circle;

