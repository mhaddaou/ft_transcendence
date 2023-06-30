import React from "react";
import Image from "next/image";
import Logo from '../image/42_logo.svg'
import Router from "next/router";
export default function Modal( ) {
  const router = Router;
  const [showModal, setShowModal] = React.useState(false);
  const click = () =>{
    router.push('http://localhost:5000/auth/42');
    
  }
  
  return ( 
    <>
        <button onClick={click}  className='z-30 py-2 px-6 bg-slate-600 rounded-full self-center md:self-start border-4 border-cyan-300 font-semibold 
                                hover:border-cyan-800 hover:bg-slate-900 hover:text-white'>Sing in with 
                <Image className=' w-6 md:w-7 inline-block ml-2' src={Logo} alt='logo' />
        </button>
  </>
   );
}