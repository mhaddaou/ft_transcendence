
import mhaddaou from '../image/mhaddaou.jpg'
import React, { use, useState } from 'react';
import BarLeft from './BarLeft'
import Image from 'next/image';
import Profile from './Profile';
const Avatar = ({ id, check } : any) => {
  const [color, setColor] = useState<string>(check === true ? "bg-green-500" : "bg-red-500");
  const [state , setState] = useState<string>(check === false ? "hidden" : "block");
  return (
    
    <div className="dropdown dropdown-end">
    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        <Image src={mhaddaou} alt='re' />
      </div>
    </label>
    <ul tabIndex={0} className={`md:hidden mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52`}>
      <li>
        <Profile />
      </li>
      <BarLeft name='Chat' check={true}/>
      <BarLeft name='Setting' check={true}/>
      <BarLeft name='Log out' check={true}/>

    </ul>
  </div>

  );
};

export default Avatar;
