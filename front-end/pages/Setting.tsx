
import Header from "@/components/Header";
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {createCanvas, loadImage} from 'canvas'
import Footer from "@/components/Footer";

import Image, { StaticImageData } from "next/image";
import Bg from '../image/bg.jpg'
import Backgroud from '../image/background.avif'
import avatar  from "../image/avatar.webp";
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import IconUpdate from "@/components/IconUpdate";
import { Hidden } from "@mui/material";
import ModeIcon from '@mui/icons-material/Mode';



class Profile{
    name :string;
    img : StaticImageData;
    bio : string;
    constructor(name : string, img : StaticImageData, bio : string){
        this.name = name;
        this.img = img;
        this.bio = bio;
    }
    GetName():string{
        return this.name;
    }
    GetImg() : StaticImageData{
        return this.img;
    }
    GetBio() : string{
        return this.bio;
    }
}








export default function Med(){

    const [check, setCheck] = useState("hidden");

    const click = () => {
        if (check === "hidden"){
            setCheck("block");
        }
        else{
            setCheck("hidden");
        }
    }

    
    let profile = new Profile("Mohamed Haddaoui", avatar, "nice");
    return (
        <div className=" bg-slate-900 h-full  flex flex-col min-h-screen">

            <div className=" sticky top-0 z-40">
            <Header check={true} />
            </div>
        <div className="containr">
            <center className=" max-w-full">
            <div className="top h-64 w-screen bg-blue-600 overflow-hidden relative" >
          <Image src={Backgroud} alt="" className="bg w-full h-full object-cover object-center absolute z-0"/>
          <div className="flex flex-col justify-center items-center relative h-full bg-black bg-opacity-50 text-white">
            <Image src={profile.img} alt="ava" className="h-24 w-24 object-cover rounded-full"/>
            <h1 className="text-2xl font-semibold">
              <span className="border-b-4 rounded-b-lg">
                {profile.name}
              </span>
              </h1>
          </div>
          </div>
          <div className="w-screen h-[800px] min-h[600px]  lg:pt-32 pt-10 sm:pt-24  ">
            <div className="  sm:w-[600px] lg:w-[800px] flex flex-col justify-center items-cente bg-slate-950  h-full rounded-3xl  
                                ">
                <div className="m-0">
                    

                <div className="bg-slate-800 rounded-xl row-span-1 col-span-5  mx-4 my-1 h-[40vh] sm:h-[38vh] lg:h-[36vh] min-h-[600px]
                xm:w-[250px] me:w-[350px]  sm:w-[480px] lg:w-[700px] grid grid-cols-5 grid-rows-6
                                    lg:mx-6 lg:my-3">

            <div className="rounded-xl  row-span-2 col-span-5 flex justify-center items-center ">
                        <div className=" relative ">
                            <Image className=" w-20 h-20 rounded-full" alt="avatar" src={profile.img}  />
                            <button onClick={click} className="absolute right-0 bottom-0 bg-red-500 rounded-full w-8 h-8">
                                <ModeIcon className="text-white w-5" />
                            </button>
                            <div className={`absolute z-50 w-[200px]  ${check}`}>
                                <IconUpdate checked={true} />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-slate-900 row-span-1 col-span-5 flex items-center justify-center mx-4 my-1 xm:h-[60px]
                                    lg:mx-6 lg:my-3">
                        <p className="text-white font-thin">New UserName</p>
                    </div>
                    <div className="rounded-xl  row-span-1 col-span-5 mx-4  flex items-center justify-center my-1 xm:h-[60px]
                                      lg:mx-6 lg:my-3">
                        <input className="h-full w-full rounded-2xl bg-slate-900 text-white px-3 font-mono" type="text" placeholder="firstName" />
                    </div>
                    <div className="rounded-xl  row-span-1 col-span-5 mx-4 my-1 xm:h-[60px]
                                    lg:mx-6 lg:my-3">
                    <input className="h-full w-full rounded-2xl bg-slate-900 text-white px-3 font-mono" type="text" placeholder="lastName" />
                    </div>
                    <button className=" col-start-3 flex flex-col justify-center items-center bg-white w-28 h-12 rounded-full border-2 border-cyan-400 text-red-500
                                        hover:bg-gray-300 hover:text-red-800 font-mono hover:border-white ">Confirm</button>
                    </div>

            </div>
            </div>

          </div>
            
            </center>

        </div >
            <footer className="mt-auto ">
                <Footer />
            </footer>
        </div>

);
}
