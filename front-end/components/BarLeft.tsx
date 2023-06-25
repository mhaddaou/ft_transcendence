import Link from "next/link";
import { useState, useContext } from "react";
import Image from "next/image";
import Game from "../image/game.svg";
import Chat from "../image/chatof.svg";
import ChatHover from '../image/chathover.svg';
import GameHover from '../image/gamehover.svg';
import Setting from '../image/settingof.svg';
import SettingHover from '../image/settingon.svg';
import Leave from '../image/leave.svg';
import LeaveHover from '../image/leaveHover.svg';
import ProfileHover from '../image/profilehover.svg'
import Profile from '../image/profile.svg'
import Router from "next/router";
import { profile } from "console";
import { MyContext, ContextTypes } from '@/components/Context';

interface PropsImg {
  name: string;
  page: string;
}

interface BarLeftProps {
  name: string;
  check: boolean;
  page: string;
}


function getImageSource({ name, page }: PropsImg) {


  if (name === "Chat") {
    if (name === page)
      return ChatHover;
    return Chat;
  }
  else if (name === "Profile") {
    if (name === page)
      return ProfileHover;
    return Profile;
  }
  else if (name === "Game") {
    if (name === page)
      return GameHover;
    return Game;
  }
  else if (name === "Setting") {
    if (name === page)
      return SettingHover;
    return Setting;
  }
  else if (name === "Logout")
    return Leave;
}
function getImageHover({ name, page }: PropsImg) {
  if (name === "Chat")
    return ChatHover;
  else if (name === "Game")
    return GameHover;
  else if (name === "Setting")
    return SettingHover;
  else if (name === "Logout")
    return LeaveHover;
  else if (name === "Profile")
    return (ProfileHover);
}

const BarLeft = (props: BarLeftProps) => {
  const router = Router;
  const context = useContext(MyContext);


  const click = () => {
    if (props.name === "Profile")
      router.push('http://localhost:3000/ft_transcendence/Dashbord');
    if (props.name === "Setting")
      router.push('http://localhost:3000/ft_transcendence/Setting');
    if (props.name === "Chat")
      router.push('http://localhost:3000/ft_transcendence/Chat')
    if (props.name === "Game")
    router.push(`http://localhost:3000/ft_transcendence/Game/?room=${context?.login}&queue=true`)
    
  }


  const stylling: string = "flex items-center justify-start w-full p-4 my-2 font-thin text-blue-500 uppercase transition-colors duration-200 border-r-4 border-blue-500 bg-gradient-to-r from-white to-blue-100 dark:from-gray-700 dark:to-gray-800";
  const stl: string = "hover:bg-gradient-to-r   hover:from-white hover:to-blue-100 flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500";
  const [img, setImg] = useState(getImageSource(props));
  const handlehover = () => {
    setImg(getImageHover(props));
  }
  const handleLeave = () => {
    setImg(getImageSource(props));
  }
  return (
    <button onClick={click} onMouseEnter={handlehover} onMouseLeave={handleLeave} className={`${props.page === props.name ? stylling : stl}`} >
      <span className="text-left">
        {img && <Image className={`${props.name === "Profile" ? 'w-8' : 'w-10'}`} alt="user" src={img} />}
      </span>
      <span className="ml-4 text-sm font-normal">{props.name}</span>
    </button>
  );
};

export default BarLeft;
