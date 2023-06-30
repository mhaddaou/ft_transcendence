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
import { FriendType } from "./Context";
import Router from "next/router";
import axios from "axios";

import { Award} from "react-feather"
interface Achievements {
  avatar: string
  condition: string
  description: string
  id: string
  title: string
}



type DataProps = number | undefined;

const getImgSrc = (name : string)  =>{
  if (name === 'smia')
  return smia;
  else if (name === 'amya' )
      return amya
  else
      return avatar;  
}





export default function GetDataHistory({matches } : {matches : MatchType[]}){
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

    const GetImage = ({name } : {name : string}) =>{
      if (name === '0')
        return <Image className="mask mask-squircle w-12 h-12" src={avatar} alt="avatar" /> 
      else
        return <img className="mask mask-squircle w-12 h-12" src={name} alt="avatar"/>

    }
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
                while (matches[i]) {
                  elements.push(
                    <div className="flex flex-row min-h-[60px] h-[14%]  mt-2 justify-center space-x-3 md:justify-between items-center bg-gray-300 md:space-x-2 lg:space-x-6 md:px-10 lg:px-32 rounded-lg">
                        <div className="flex  md:space-x-10  w-1/3 h-full items-center">
                        <GetImage name={matches[i].avatarA} />
                            <div className="font-mono font-semibold md:text-[20px]">{matches[i].usernameA}</div>
                        </div>
                        <div className="flex w-1/5 md:w-[90px]    h-full items-center justify-between md:justify-center md:space-x-6 ">
                            <div className={`font-bold text-lg ${matches[i].scoreB > matches[i].scoreA ? 'text-red-500' : 'text-green-600' }`}>{matches[i].scoreA}</div>
                            <div className="font-bold md:text-xl  md:uppercase">vs</div>
                            <div className={`font-bold text-lg ${matches[i].scoreA > matches[i].scoreB ? 'text-red-500' : 'text-green-600' } `}>{matches[i].scoreB}</div>

                        </div>
                        <div className="flex justify-around md:justify-between md:space-x-10  w-1/3 h-full items-center ">
                            <div className="font-mono font-semibold md:text-[20px]">{matches[i].usernameB}</div>
                            <div>
                              <GetImage name={matches[i].avatarB} />

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

export function GetDataAchievement() {
  const [Data, setData] = useState([]);
  const context = useContext(MyContext);

  useEffect(() => {
    //here for fetching data
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/user/acheivement",
          {
            login: context?.login,
          },
          {
            headers: {
              Authorization: `Bearer ${context?.token}`,
            },
          }
        );
        console.log(res.data)
        setData(res.data)
        // http://localhost:5000/auth/2-FA post login code
      } catch (error) {
        // Handle the error here
        console.error(error);
      }
    };
    // and here for setting the tade to usestate data
    console.log('data for achievments ');
    fetchData()
  })
  if (Data.length == 0) {
    return (
      <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono '>
        Not have Achievement yet
      </p>
    )
  }
  else {
    return (
      <div>
        <div className="grid grid-cols-3 items-center m-5 gap-4">
        {
          Data.map((e: Achievements) => (
            <div className="p-2 text-center bg-green-200  flex  items-center justify-around">
               <Award/>{ e.title}</div>

          ))
        }
            </div>

      </div>
    );
  }
}

export function GetDataFriend() {
    const context = useContext(MyContext);
  const router = Router;

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
    
    const removefriend = (login: string) => {
      context?.setFriends(prevFriends =>
        prevFriends.filter(friend => friend.login !== login)
      );
    };
    const removeChat = (login : string) =>{
      context?.setContactChat(prevcontact =>
        prevcontact.filter(chat => chat.login !== login))
    }

    const blockUser = (friend : FriendType) => {
      if (context?.socket)
      context?.socket.emit('block', {
        blockedLogin: friend.login,
        stillEnemy: true,
      })
      removefriend(friend.login);
      removeChat(friend.login);
      context?.setBlackList((prev) =>[...prev, friend]);
    }
  
    useEffect(() => {
      // Fetch data and set it to the useState 'Data' here
      console.log('data');
    });
    

    const sendMsg = (login : string, username : string, )=>{
     
      setName(username);
      setLogin(login);
        setIsModalOpen(true);

    }
    const deleteFriend = (friend : FriendType) =>{
      context?.socket?.emit('removeFriend', {login : friend.login});
      removefriend(friend.login);
    }
    const viewProfile = (friend : FriendType) =>{
      context?.setProfileuser(friend.login);
      router.push(`http://localhost:3000/Profile/${context?.profileuser}`)
    }
  
    if (context?.friends.length === 0) {
      
      return (
        <p className="text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono">
          Not have any friend yet
x        </p>
      );
    } else {
      return (
        <div className="flex flex-col w-full h-full">
          <div className="w-full bg-gray-300 rounded-t-2xl h-[14%] flex justify-around items-center font-semibold text-sm text-left text-gray-500 z-20">
            <div>Avatar</div>
            <div>Name</div>
            <div>Details</div>
          </div>
          <div className="w-full h-[86%] overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-300">
            {
              context?.friends.map((friend : FriendType) =>{
                return (
                  <div className="h-[16%] max-h-[16%] bg-gray-200 flex justify-around items-center my-2" >
                      <ModalChat  isOpen={isModalOpen} closeModal={closeModal} name={name} login={login}/>
                      <div className="h-full w-1/3 flex justify-center items-center">
                        <Image className="mask mask-squircle w-8 h-8 sm:w-12 sm:h-12" src={getImgSrc(friend.avatar)} alt="avatar" />
                      </div>
                      <div className="w-1/3 text-center">{friend.username}</div>
                      <div className="w-1/3 text-center z-20">
                        <div className="dropdown dropdown-left ">
                        <label tabIndex={0} className="btn btn-ghost btn-xs">details</label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                          <li><button onClick={() =>{
                            sendMsg(friend.login, friend.username);
                            
                          }}>Send Msg</button></li>
                          <li><button onClick={() => viewProfile(friend)}>View Profile</button></li>
                          <li><button onClick={() =>deleteFriend(friend)}>Delete</button></li>
                          <li><button onClick={() => blockUser(friend)}>Block</button></li>
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


const DatSend = () =>{
  const context = useContext(MyContext)
  const rmv = (login: string) => {
    context?.setWaitToAccept(prev =>
      prev.filter(friend => friend.login !== login)
    );
  };

  
  
  const removeInvite = (login : string) =>{
    context?.socket?.emit('removeInvite',{login: login});
    rmv(login);
    console.log(login);

  }
  if (context?.waitToAccept.length === 0){
    return (
      <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono '>
          You are not Add any one

      </p>
  )
  }

  else
    return (
      <div className="flex flex-col w-full h-full">
            <div className="w-full bg-gray-300 rounded-t-2xl h-[14%] flex justify-around items-center font-semibold text-sm text-left text-gray-500 z-20">
              <div>Avatar</div>
              <div>Name</div>
              <div>Details</div>
            </div>
            <div className="w-full h-[86%] overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-300">
              {
                context?.waitToAccept.map((friend : FriendType) =>{
                  return (
                    <div key={friend.login} className="h-[16%] max-h-[16%] bg-gray-200 flex justify-around items-center my-2" >
                        {/* <ModalChat  isOpen={isModalOpen} closeModal={closeModal} name={name} login={login}/> */}
                        <div className="h-full w-1/3 flex justify-center items-center">
                          <Image className="mask mask-squircle w-8 h-8 sm:w-12 sm:h-12" src={getImgSrc(friend.avatar)} alt="avatar" />
                        </div>
                        <div className="w-1/3 text-center">{friend.username}</div>
                        <div className="w-1/3 text-center z-20">
                          <div className="dropdown dropdown-left ">
                          <button onClick={() => removeInvite(friend.login)}  className="btn btn-ghost btn-xs">Remove Invite</button>
                          
                        </div>
                        </div>
                      </div>
                  )
                })
              }
            </div>
          </div>
    )
}


const DataRecieved = () =>{



  const context = useContext(MyContext);
  
  const removefriend = (login: string) => {
    context?.setPendingInvitation(prevChannels =>
      prevChannels.filter(channel => channel.login !== login)
    );
  };

  const AcceptFriend = (friend : FriendType) =>{
    removefriend(friend.login)
    context?.socket?.emit('acceptFriend',
    {login: friend.login,
     accepte : true})
    context?.setFriends((prev) =>[...prev, friend]);

    // console.log('accept friend')


  }

  const deleteinvit = (friend : FriendType) => {
    removefriend(friend.login)
    context?.socket?.emit('acceptFriend',{
      login: friend.login,
      accepte : false,  
    })
    if (context?.socket)
    context?.socket.on('message',(pay) =>{
      if (pay)
        console.log(pay);
    })
    if (context?.socket)
    context?.socket.on('errorMessage',(pay) =>{
      if (pay)
        console.log(pay);
    })
    
    removefriend(friend.login);

  }


  if (context?.pendingInvitation.length === 0)
  return (
    <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono '>
        You don't have any invitation

    </p>
  )
  
  else
    return (
      <div className="flex flex-col w-full h-full">
            <div className="w-full bg-gray-300 rounded-t-2xl h-[14%] flex justify-around items-center font-semibold text-sm text-left text-gray-500 z-20">
              <div>Avatar</div>
              <div>Name</div>
              <div>Details</div>
            </div>
            <div className="w-full h-[86%] overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-300">
              {
                context?.pendingInvitation.map((friend : FriendType) =>{
                  return (
                    <div key={friend.login} className="h-[16%] max-h-[16%] bg-gray-200 flex justify-around items-center my-2" >
                        {/* <ModalChat  isOpen={isModalOpen} closeModal={closeModal} name={name} login={login}/> */}
                        <div className="h-full w-1/3 flex justify-center items-center">
                          <Image className="mask mask-squircle w-8 h-8 sm:w-12 sm:h-12" src={getImgSrc(friend.avatar)} alt="avatar" />
                        </div>
                        <div className="w-1/3 text-center">{friend.username}</div>
                        <div className="w-1/3 text-center z-20">
                          <div className="dropdown dropdown-left ">
                          <label tabIndex={0} className="btn btn-ghost btn-xs">details</label>
                          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><button onClick={()=>AcceptFriend(friend)}>Accept</button></li>
                            <li><button onClick={()=>deleteinvit(friend)}>Decline</button></li>
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


const BlackList = () =>{

  const context = useContext(MyContext);

  const rmv = (login: string) => {
    context?.setBlackList(prev =>
      prev.filter(friend => friend.login !== login)
    );
  };
  const removeBlock = (friend : FriendType) => {
    context?.socket?.emit('block', {
      blockedLogin : friend.login,
      stillEnemy : false,
    })
    rmv(friend.login);
    
  }
  if (context?.blackList.length === 0)
  return (
    <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono '>
        Black List is empty
    </p>
  )
  else
    return (
      <div className="flex flex-col w-full h-full">
            <div className="w-full bg-gray-300 rounded-t-2xl h-[14%] flex justify-around items-center font-semibold text-sm text-left text-gray-500 z-20">
              <div>Avatar</div>
              <div>Name</div>
              <div>Details</div>
            </div>
            <div className="w-full h-[86%] overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-300">
              {
                context?.blackList.map((friend : FriendType) =>{
                  return (
                    <div key={friend.login} className="h-[16%] max-h-[16%] bg-gray-200 flex justify-around items-center my-2" >
                        <div className="h-full w-1/3 flex justify-center items-center">
                          <Image className="mask mask-squircle w-8 h-8 sm:w-12 sm:h-12" src={getImgSrc(friend.avatar)} alt="avatar" />
                        </div>
                        <div className="w-1/3 text-center">{friend.username}</div>
                        <div className="w-1/3 text-center z-20">
                          <div className="dropdown dropdown-left ">
                          <button onClick={() => removeBlock(friend)} className="btn btn-ghost btn-xs">Remove Block</button>
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





export {DatSend, DataRecieved, BlackList};