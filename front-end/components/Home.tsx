import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Header from '@/components/Header';
import Icon from '@/images/icon.png'
import Form from '@/components/Form';
import Img from './pong.png'




import React, { useState } from 'react';
import Footer from '@/components/Footer';
import { GetServerSideProps } from 'next';
import axios from 'axios';

class Data{
  id : string = "";
  node_id: string = "";
  full_name : string = "";

  constructor(_id: string, _node_id: string, _full_name: string){
    this.id = _id;
    this.node_id = _node_id;
    this.full_name = _full_name;
  }
}
export default function HomePage({pro} : any) {
  const [text, setText] = useState("");
  // let data  = new Data();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-400 to-blue-500">
    <Header check={true}/>
    <div className="flex flex-grow">
      <div className="w-1/3">
        {/* First div with one column */}
        <div className=''></div>
      </div>
      <div className="w-2/3 flex flex-col">
        <div className="flex">
          {/* <div className="bg-white w-1 h-8 mr-2 animate-pongleft"></div> */}
          {/* <div className="bg-white w-3 h-8 animate-pongleft"></div> */}
        </div>
        <div className="flex justify-center items-center" style={{ marginTop: '-140px' }}>
          {/* <div
            style={{ animationName: 'bol', animationDuration: '4s', animationIterationCount: 'infinite' }}
            className="z-20 w-4 h-4 bg-slate-400 rounded-full translate-x-7"
          ></div> */}
          
    <div className="w-full h-screen flex flex-col justify-center items-center ">
  <div className="flex items-start">
    {/* <div className="bg-white w-1 h-8 mr-2 animate-pongleft"></div> */}
    {/* <div className="bg-white w-3 h-8 animate-pongleft"></div> */}
  </div>
  <div className="relative ">
    <div className="centered-element">
    <div
    style={{  animationName: 'pongleft', animationDuration: '3s', animationIterationCount: 'infinite' }}
    className=" absolute   w-1 h-12 bg-gray-50 z-40 pnglft"
  ></div>
  <div
    style={{  animationName: 'pongright', animationDuration: '3s', animationIterationCount: 'infinite' }}
    className=" absolute   w-1 h-12 bg-gray-50 z-30 pngrht mr-3"
  ></div>
  <div
    style={{ left:'5px', animationName: 'bol', animationDuration: '4s', animationIterationCount: 'infinite' }}
    className=" absolute   w-5 h-5 rounded-full bg-gray-400 z-40 "
  ></div>
  <div
  style={{animationName: 'cleft', animationDuration: '4s', animationIterationCount: 'infinite'}} 
  className=' absolute w-1/4 h-1/2 bg-red-600 -left-3 -top-3 rounded-2xl z-10'></div>
  <div style={{right:'-1px', bottom:'-15px', animationName: 'cleft', animationDuration: '4s', animationIterationCount: 'infinite'}} className=' absolute w-1/4 h-1/2 bg-green-600  rounded-2xl z-10'></div>
  {/* <div className='absolute w-1/4 h-1/2 bg-red-400 rounded-2xl -left-3 -top-3 z-20 animation-squa '></div> */}
      <Image
        className="z-20 pr-3 relative"
        src={Img}
        alt="Picture of the author"
        width={900}
        height={900}
        
      />
    
    </div>
    <div></div>
    {/* <div
      style={{ translate:'15',animationName: 'pongright', animationDuration: '2s', animationIterationCount: 'infinite' }}
      className="absolute right-0 -translate-x-2 w-5 h-12 z-20 bg-gray-50 "
    ></div> */}
  </div>
</div>



        </div>
      </div>
    </div>
    <div className="mt-auto">
      <Footer />
    </div>
  </div>
  
  



  
  );
};