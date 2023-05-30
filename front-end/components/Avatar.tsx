
import mhaddaou from '../image/mhaddaou.jpg'
import React, { use, useState } from 'react';
import BarLeft from './BarLeft'
import Image from 'next/image';
import Profile from './Profile';
import { CallBarLeft } from './Functions';

interface PropsAvatar{
  id : number;
  check : boolean;
  page : string;
}

const Avatar = (props : PropsAvatar) => {
  const [color, setColor] = useState<string>(props.check === true ? "bg-green-500" : "bg-red-500");
  const [state , setState] = useState<string>(props.check === false ? "hidden" : "block");
  return (
    
    <div className="dropdown dropdown-end">
    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        <Image src={mhaddaou} alt='re' />
      </div>
    </label>
    <ul tabIndex={0} className={`md:hidden mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52`}>
    <CallBarLeft page={props.page} />
    </ul>
  </div>

  );
};

export default Avatar;
