import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Header from '@/components/Header';
import Icon from '@/images/icon.png'
import Form from '@/components/Form';
import Img from './pong.png'
import Bgin from '../image/Bgin.webp'
import First from '../image/first.png'
import Sky from '../image/sky.png'
import Intra from '../image/intra.png'
import Qua from '../image/number-42-16.png'
import Logo from '../image/42_logo.svg'
import Logos from '../image/logos.png'
import Game from '../image/index.svg'
import Mhaddaou from '../image/mhaddaou.jpg'
import Smia from '../image/smia.jpg'
import Amya from '../image/amya.jpg'
import Hastid from '../image/hastid.jpg'
import Sm from '../image/smv.svg'
import Cards from '@/components/Cards';
import Router from 'next/router';

import React, { useState } from 'react';
import Footer from '@/components/Footer';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import HBest from '@/components/HBest';
import Link from 'next/link';
import { useRef } from 'react';
import Modal from './ft_transcendence/Pop';


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
export default function HomePage({pro}:any) {



  const value = useRef<HTMLInputElement | null>(null);

  const router = Router;
  const [text, setText] = useState("");
  const images = [Smia, Amya, Hastid, Mhaddaou];
  const Names = ["Said Mia", "Abderrahmane Mya", "Hamza Astid", "Mohamed Haddaoui"];
 

  const [modal , setModal] = useState('modal-toggle')
    const [hid, setHid] = useState('block')
    
    const [showModal, setModadl] = useState(false);
    const click = () =>{
       setModadl(true);
    }
    const Sing = () =>{
      if (value.current){
        console.log(value.current.value);
        router.push('http://localhost:3000/Dashbord');
      }
    }
  
  return (

    
      <div className=' bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen '>
        <HBest />
        <section>
          <div className='container mx-auto  px-6 space-x-8 flex flex-col-reverse md:flex-row '>
            <div className='md:w-1/2 bg-slate-5 flex flex-col  space-y-8 justify-center py-8 md:py-20 md:space-y-10 text-center md:text-left text-slate-900'>
              <h1 className='lg:font-mono lg:font-semibold text-3xl md:text-5xl text-center md:border-b-4 md:pb-5'>ft_transcendence</h1>
              <p className='text-lg md:text-3xl font-light '>This project is about doing something you’ve never done before. Remind yourself the beginning of your journey in computer science. Look at you now. Time to shine!</p>
              <Modal />
            </div>
            <div className='md:w-1/2 '>
              <Image src={Game} alt='image' />
            </div>
          </div>
        </section>
        <section>
          <div className=' container mx-auto my-32 text-center'>
            <h1 className='text-3xl font-bold pb-16'>"work of this project"</h1>
            <div className='mt-10 flex flex-col  space-x-0 space-y-5 md:space-x-5  md:space-y-0 md:flex-row'>
              {
                (()=>{
                  let elements = [];
                  for (let i = 0;  i < 4; i++){
                    elements.push(<Cards name={Names[i]} img={images[i]} />);
                  }
                  return (elements);
                }
                )()
              }
            </div>
          </div>
        </section>
        <footer>
          <div className=' h-full flex justify-center items-center  '>
            <Image src={First} alt='logo' />
          </div>
          <div className='py-8 bg-slate-200 shadow-2xl shadow-black '>

            <Footer />
          </div>
          

        </footer>
        


        
      </div>
    
  );
};







