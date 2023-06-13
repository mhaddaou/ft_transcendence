import { table } from "console";
import React, { useState, useEffect, useContext } from "react";
import mhaddaou from '../image/mhaddaou.jpg'
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import smia from '../image/smia.jpg'
import amya from '../image/amya.jpg'
import { MyContext, MatchType } from "./Context";
import avatar from '../image/avatar.webp'
import {ModalChat} from "./Modal";



type DataProps = number | undefined;





export default function GetDataHistory(){
  const [Img, setImg] = useState<string | StaticImageData>('');
    const context = useContext(MyContext);
    const TreatImage = (img : string)=>{
      if (img.length < 6){
        //string
        if (img === '0')
          setImg(avatar);
        if (img === 'smia')
          setImg(smia);
      }else{
        //StaticImageData
        setImg(img);
  
      }
    }
    
    
    
    useEffect(()=>{
      if (context?.img)
        TreatImage(context?.img);
      
      
    },[context?.img])
    useEffect(() =>{
        //here for fetching data
        // and here for setting the tade to usestate data
        console.log('data');
    })
        if (context?.match.length == 0){
            return (
                <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono'>
                    Not have history yet
                </p>
            )
        }
        else{
          return (
            <>
                    <div className="flex flex-col w-full h-full   overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-300 ">

              {(() => {
                const elements = [];
                let i = 0;
                while (context?.match[i]) {
                  elements.push(
                    <div className="flex flex-row min-h-[60px] h-[14%]  mt-2 justify-center space-x-3 md:justify-between items-center bg-gray-300 md:space-x-2 lg:space-x-6 md:px-10 lg:px-32 rounded-lg">
                        <div className="flex  md:space-x-10  w-1/3 h-full items-center">
                            
                            {
                              (() =>{
                                const elements = [];
                                elements.push(
                                  typeof(Img) === "string" ? <img className="w-12 h-12 mask mask-squircle" src={Img} alt='av'  /> : <Image src={Img} alt='av' width={300} height={300} />
                                )
                                return elements;
                              })()
                            }

                           
                            <div className="font-mono font-semibold md:text-[20px]">{context?.name}</div>
                        </div>
                        <div className="flex w-1/5 md:w-[90px]    h-full items-center justify-between md:justify-center md:space-x-6 ">
                            <div className={`font-bold text-lg ${context.match[i].scoreB > context.match[i].scoreA ? 'text-red-500' : 'text-green-600' }`}>{context.match[i].scoreA}</div>
                            <div className="font-bold md:text-xl  md:uppercase">vs</div>
                            <div className={`font-bold text-lg ${context.match[i].scoreA > context.match[i].scoreB ? 'text-red-500' : 'text-green-600' } `}>{context.match[i].scoreB}</div>

                        </div>
                        <div className="flex justify-around md:justify-between md:space-x-10  w-1/3 h-full items-center ">
                            <div className="font-mono font-semibold md:text-[20px]">{context?.match[i].username}</div>
                            <div>
                            <Image className="mask mask-squircle w-12 h-12" src={smia} alt="avatar" />

                            </div>
                        </div>

                    </div>
                  );
                  i++;
                }
                return elements;
              })()}
                    </div>

            </>
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
    console.log()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [login, setLogin] = useState('');
    const [name, setName] = useState('');

    const openModal = () => {
      setIsModalOpen(true);
    };


    const closeModal = () => {
      setIsModalOpen(false);
    };
    
  
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

    const sendMsg = (login : string, username : string, )=>{
     
      setName(username);
      setLogin(login);
        setIsModalOpen(true);

    }
    console.log("this is friends " ,context?.friends);
  
    if (context?.friends.length === 0) {
      
      return (
        <p className="text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono">
          Not have any friend yet
        </p>
      );
    } else {
      return (
        <div className="flex flex-col w-full h-full">
          <div>
            {
            }

            
          </div>
          <div className="w-full bg-gray-300 rounded-t-2xl h-[14%] flex justify-around items-center font-semibold text-sm text-left text-gray-500 z-20">
            <div>Avatar</div>
            <div>Name</div>
            <div>Details</div>
          </div>
          <div className="w-full h-[86%] overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-300">
            {
              context?.friends.map((friend) =>{
                return (
                  <div className="h-[16%] max-h-[16%] bg-gray-200 flex justify-around items-center my-2" >
                      <ModalChat  isOpen={isModalOpen} closeModal={closeModal} name={name} login={login}/>
                      <div className="h-full w-1/3 flex justify-center items-center">
                        <Image className="mask mask-squircle w-8 h-8 sm:w-12 sm:h-12" src={getImgSrc(friend.loginB)} alt="avatar" />
                      </div>
                      <div className="w-1/3 text-center">{friend.username}</div>
                      <div className="w-1/3 text-center z-20">
                        <div className="dropdown dropdown-left ">
                        <label tabIndex={0} className="btn btn-ghost btn-xs">details</label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                          <li><button onClick={() =>{
                            sendMsg(friend.loginB, friend.username);
                            
                          }}>Send Msg</button></li>
                          <li><Link href="#">View Profile</Link></li>
                        </ul>
                      </div>
                      </div>
                    </div>
                )
              })
            }
          </div>
        </div>
      );
    }
  
}


    