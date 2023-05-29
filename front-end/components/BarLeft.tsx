import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Game from "../image/game.svg";
import Chat from "../image/chatof.svg";
import ChatHover from '../image/chathover.svg';
import GameHover from '../image/gamehover.svg';
import Setting from '../image/settingof.svg';
import SettingHover from '../image/settingon.svg';
import Leave from '../image/leave.svg';
import LeaveHover from '../image/leaveHover.svg';
import Router from "next/router";

interface BarLeftProps {
  name: string;
  check: boolean;
}
function getImageSource(name : string){
  if (name === "Chat")
    return Chat;
  if (name === "Game")
    return Game;
  if (name === "Setting")
    return Setting;
  if (name === "Log out")
    return Leave;
}
function getImageHover(name : string){
  if (name === "Chat")
    return ChatHover;
  if (name === "Game")
    return GameHover;
  if (name === "Setting")
    return SettingHover;
  if (name === "Log out")
    return LeaveHover;
}

const BarLeft = (props: BarLeftProps) => {
  const [img, setImg] = useState(getImageSource(props.name));
    const handlehover = () =>{
        setImg(getImageHover(props.name));
    }
    const handleLeave = ()=>{
        setImg(getImageSource(props.name));
    }
  return (
    <Link onMouseEnter={handlehover} onMouseLeave={handleLeave} className="  hover:bg-gradient-to-r hover:from-white hover:to-blue-100 flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500" href="#">
      <span className="text-left">
        {img && <Image className="w-10" alt="user" src={img} />}
      </span>
      <span className="ml-4 text-sm font-normal">{props.name}</span>
    </Link>
  );
};

export default BarLeft;
