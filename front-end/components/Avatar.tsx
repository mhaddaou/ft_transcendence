
import mhaddaou from '../image/mhaddaou.jpg'
import React, { use, useState } from 'react';
import Image from 'next/image';
const Avatar = ({ id, check } : any) => {
  const [color, setColor] = useState<string>(check === true ? "bg-green-500" : "bg-red-500");
  return (
    
<a href="#" className="relative block">
    <Image alt="profil" src={mhaddaou} className="mx-auto object-cover rounded-full h-10 w-10 "/>
    <span className={`absolute w-3 h-3 md:w-4 md:h-4 transform -translate-x-1/2 ${color} border-2 border-white rounded-full left-[75%] md:left-[80%] -bottom-0 md:-bottom-1`}>
    </span>
</a>

  );
};

export default Avatar;
