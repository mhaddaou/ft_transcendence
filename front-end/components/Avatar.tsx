
import mhaddaou from '../image/mhaddaou.jpg'
import React, { use, useState, useEffect, useContext } from 'react';
import BarLeft from './BarLeft'
import Image, { StaticImageData } from 'next/image';
import Profile from './Profile';
import { CallBarLeft } from './Functions';
import { MyContext } from './Context';
import avatar from '../image/avatar.webp'
import smia from '../image/smia.jpg'


interface PropsAvatar{
  id : number;
  check : boolean;
  page : string;
}

const Avatar = (props : PropsAvatar) => {




  const context = useContext(MyContext);
  const [color, setColor] = useState<string>(props.check === true ? "bg-green-500" : "bg-red-500");
  const [state , setState] = useState<string>(props.check === false ? "hidden" : "block");
  const [Img, setImg] = useState<string | StaticImageData>('');
  // const TreatImage = (img : string)=>{
  //   if (img.length < 6){
  //     //string
  //     if (img === '0')
  //       setImg(avatar);
  //     if (img === 'smia')
  //       setImg(smia);
  //   }else{
  //     //StaticImageData
  //     setImg(img);

  //   }
  // }
  
  
  
  // useEffect(()=>{
  //   if (context?.img)
  //     TreatImage(context?.img);
    
    
  // },[context?.img])

  const GetImage = ({ name }: { name: string | undefined }) => {
    if (name === '0')
      return <Image className="mask mask-squircle w-8 h-8 sm:w-12 sm:h-12" src={avatar} priority alt="avatar" />
    else
      return <img className="mask mask-squircle w-8 h-8 sm:w-12 sm:h-12" src={name}  alt="avatar" />
  
  }

  return (
    
    <div className="dropdown dropdown-end">
    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        {/* {
          (() =>{
            const elements = [];
            elements.push(
              typeof(Img) === "string" ? <img src={Img} alt='av' width={200} height={200} /> : <Image src={Img} alt='av' width={200} height={200} />
            )
            return elements;
          })()
        } */}
        <GetImage name={context?.img} />

        

        
      </div>
    </label>
    <ul tabIndex={0} className={`md:hidden mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52`}>
    <CallBarLeft page={props.page} />
    </ul>
  </div>

  );
};

export default Avatar;

export const AvatarInfo = ({user} : {user : string}) =>{
  // const [Img, setImg] = useState<StaticImageData | undefined>(undefined);
  // useEffect(() =>{
  //   if (user === "mhaddaou")
  //     // setImg(mhaddaou);
  // },[])

  return (
    <div className=' w-full h-full'>
      <div className='w-full h-[20%]  flex justify-center items-center '>
          {/* { Img && <Image className='w-32 rounded-full border-spacing-1 border-4 border-slate-400'  src={Img} alt='aav' />} */}
      </div>
      <div className='w-full h-[80%]  flex flex-col items-center text-lg '>
        <p>nick name</p>
        <p>another things</p>
        <p>and so forth</p>
      </div>
    </div>
  );

}

