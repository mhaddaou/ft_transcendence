import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Linkedin from '../image/linkedin.svg' 

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const yourName = 'Mohamed haddaoui';

  return (
   <div className='container mx-auto flex justify-between items-center  shadow-blue-600'>
      <div className='md:bg-slate-00 md:py-2 md:px-6 md:shadow-2xl md:shadow-blue-600 md:rounded-xl md:opacity-90 '>

      <Link className='flex flex-col md:flex-row   items-center' href='https://www.linkedin.com/in/mohamed-haddaoui-26b28423a/'> 
      <Image className='w-10 ' src={Linkedin} alt='link' />
      <p className='font-semibold'>Mhaddaou</p>
      </Link>
      </div>

      <div className='md:bg-slate-00 md:py-2 md:px-6 md:shadow-2xl md:shadow-blue-600 md:rounded-xl md:opacity-90 '>

      <Link className='flex flex-col md:flex-row   items-center' href='https://www.linkedin.com/in/mohamed-haddaoui-26b28423a/'> 
      <Image className='w-10 ' src={Linkedin} alt='link' />
      <p className='font-semibold'>Mhaddaou</p>
      </Link>
      </div>

      <div className='md:bg-slate-00 md:py-2 md:px-6 md:shadow-2xl md:shadow-blue-600 md:rounded-xl md:opacity-90 '>

      <Link className='flex flex-col md:flex-row   items-center' href='https://www.linkedin.com/in/mohamed-haddaoui-26b28423a/'> 
      <Image className='w-10 ' src={Linkedin} alt='link' />
      <p className='font-semibold'>Mhaddaou</p>
      </Link>
      </div>

      <div className='md:bg-slate-00 md:py-2 md:px-6 md:shadow-2xl md:shadow-blue-600 md:rounded-xl md:opacity-90 '>

      <Link className='flex flex-col md:flex-row   items-center' href='https://www.linkedin.com/in/mohamed-haddaoui-26b28423a/'> 
      <Image className='w-10 ' src={Linkedin} alt='link' />
      <p className='font-semibold'>Mhaddaou</p>
      </Link>
      </div>




    

      
      
    

   </div>
  );
};

export default Footer;



