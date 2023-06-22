import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Circle from './Circle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennis } from '@fortawesome/free-solid-svg-icons';


interface HeadProps{
  check : boolean;
}


const Header = ({check} : HeadProps) => {
  

  return (
      <header className='z-30 bg-slate-950 text-white max-w-screen '>
        <div className='flex justify-around items-center p sm:pl-20 pt-5 pb-3 w-screen font-mono'>
        <Link style={{animationName:'ping', animationDuration:'2s'}}  href="/">
          <div className='flex justify-center items-center gap-2'>

        <FontAwesomeIcon className=''  icon={faTableTennis} spin size="lg" />

          <p className='border-b-4 rounded-xl bg-gradient-to-t from-slate-400 to-slate-700'>

          <span className=' font-black'>P</span>
          ing
          <span className=' font-black'>P</span>
          ong
          </p>
          </div>
          </Link>

      <div style={{animationName:'head', animationDuration:'2s'}} className=' space-x-7 flex  items-center'>
        <Link  className='hover:text-white  hover:border-b-2 hover:border-cyan-400' href="/">Home</Link>
        <Link className='hover:text-white hover:border-b-2 hover:border-cyan-400' href="/about">Chat</Link>
        <Link className='hover:text-white hover:border-b-2 hover:border-cyan-400' href="/blog/hello-world">Contact</Link>
        <div className='relative -left-3 sm:-left-0'>
        <Circle check={check} />

        </div>
      </div>

        </div>
      </header>
    
  );
};     
  
  export default Header;
  
  
