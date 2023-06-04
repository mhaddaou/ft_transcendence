import { table } from "console";
import React, { useState, useEffect, useContext } from "react";
import mhaddaou from '../image/mhaddaou.jpg'
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import smia from '../image/smia.jpg'
import amya from '../image/amya.jpg'
import { MyContext } from "./Context";
import avatar from '../image/avatar.webp'


type DataProps = number | undefined;





export default function GetDataHistory(){
    const context = useContext(MyContext);
    const [Data, setData] = useState(['name']);
    useEffect(() =>{
        //here for fetching data
        // and here for setting the tade to usestate data
        console.log('data');
    })
        if (Data.length == 0){
            return (
                <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono'>
                    Not have history yet
                </p>
            )
        }
        else{
            return (
                <div className="flex flex-col w-full h-full   overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-300 ">
                    <div className="flex flex-row min-h-[60px] h-[14%]  mt-2 justify-center space-x-3 md:justify-center items-center bg-gray-300 md:space-x-2 lg:space-x-6 md:px-10 lg:px-32 rounded-lg">
                        <div className="flex justify-around md:justify-end md:space-x-10  w-1/3 h-full items-center">
                            <div>
                            <Image className="mask mask-squircle w-12 h-12" src={mhaddaou} alt="avatar" />

                            </div>
                            <div className="font-mono font-semibold md:text-[20px]">{context?.name}</div>
                        </div>
                        <div className="flex w-1/5 md:w-[90px]    h-full items-center justify-between md:justify-center md:space-x-6 ">
                            <div className="font-bold text-lg text-red-500">4</div>
                            <div className="font-bold md:text-xl  md:uppercase">vs</div>
                            <div className="font-bold text-lg text-green-600">5</div>

                        </div>
                        <div className="flex justify-around md:justify-start md:space-x-10  w-1/3 h-full items-center ">
                            <div className="font-mono font-semibold md:text-[20px]">smia</div>
                            <div>
                            <Image className="mask mask-squircle w-12 h-12" src={smia} alt="avatar" />

                            </div>
                        </div>

                    </div>
                    </div>
            );
        }
}

export  function GetDataAchievement(){
    const [Data, setData] = useState([]);
    useEffect(() =>{
        //here for fetching data
        // and here for setting the tade to usestate data
        console.log('data');
    })
        if (Data.length == 0){
            return (
                <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono '>
                    Not have Achievement yet

                </p>
            )
        }
        else{
            return (
                <div>
                    datahere;
                </div>
            );
        }
}

export function GetDataFriend() {
    const context = useContext(MyContext);
    const [Data, setData] = useState(context?.friends ?? []);
  
    useEffect(() => {
      // Fetch data and set it to the useState 'Data' here
      console.log('data');
    });
    const getImgSrc = (name : string)  =>{
        if (name === 'smia')
        return smia;
        else if (name === 'amya' )
            return amya
        else
            return avatar;  
    }
  
    if (Data.length === 0) {
      
      return (
        <p className="text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono">
          Not have any friend yet
        </p>
      );
    } else {
      return (
        <div className="flex flex-col w-full h-full">
          <div className="w-full bg-gray-300 rounded-t-2xl h-[14%] flex justify-around items-center font-semibold text-sm text-left text-gray-500">
            <div>Avatar</div>
            <div>Name</div>
            <div>Details</div>
          </div>
          <div className="w-full h-[86%] overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-300">
            {Data.map((friend) => (
              <div className="h-[16%] max-h-[16%] bg-gray-200 flex justify-around items-center my-2" >
                <div className="h-full w-1/3 flex justify-center items-center">
                  <Image className="mask mask-squircle w-8 h-8 sm:w-12 sm:h-12" src={getImgSrc(friend)} alt="avatar" />
                </div>
                <div className="w-1/3 text-center">{friend}</div>
                <div className="w-1/3 text-center">
                  <button className="btn btn-ghost btn-xs">details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
  
  