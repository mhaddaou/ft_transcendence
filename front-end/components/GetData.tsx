import { table } from "console";
import React, { useState, useEffect, useContext } from "react";
import mhaddaou from '../image/mhaddaou.jpg'
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import smia from '../image/smia.jpg'
import amya from '../image/amya.jpg'
import { MyContext, MatchType, AchievementType, userBlockedType, LeaderBoardType } from "./Context";
import avatar from '../image/avatar.webp'
import { ModalChat } from "./Modal";
import { FriendType } from "./Context";
import Router from "next/router";
import axios from "axios";

import first from '../image/firstplace-removebg-preview.png'
import second from '../image/secondplace-removebg-preview.png'
import third from '../image/thirdplace-removebg-preview.png'

import { Award } from "react-feather"
import { GetAvatar, checkIs7rag } from "./Functions";
interface Achievements {
  avatar: string
  condition: string
  description: string
  id: string
  title: string
}



type DataProps = number | undefined;

const getImgSrc = (name: string) => {
  if (name === 'smia')
    return smia;
  else if (name === 'amya')
    return amya
  else
    return avatar;
}


const GetImage = ({ name }: { name: string | undefined }) => {
  if (name === '0')
    return <Image className="mask mask-squircle w-8 h-8 sm:w-12 sm:h-12" src={avatar} alt="avatar" />
  else
    return <img className="mask mask-squircle w-8 h-8 sm:w-12 sm:h-12" src={name} alt="avatar" />

}




export default function GetDataHistory({ matches }: { matches: MatchType[] }) {
  const [Img, setImg] = useState<string | StaticImageData>('');
  const context = useContext(MyContext);
  



 
  useEffect(() => {
    //here for fetching data
    // and here for setting the tade to usestate data
    console.log('data');
  })

  const GetImage = ({ name }: { name: string }) => {
    if (name === '0')
      return <Image className="mask mask-squircle w-12 h-12" src={avatar} alt="avatar" />
    else
      return <img className="mask mask-squircle w-12 h-12" src={name} alt="avatar" />

  }
  if (context?.match.length == 0) {
    return (
      <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono'>
        Not have history yet
      </p>
    )
  }
  else {
    return (
      <>
        <div className="flex flex-col w-full h-full   overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-300 ">

          {context?.match.map((match =>{
            return (
              <div key={match.loginA} className="flex flex-row min-h-[60px] h-[14%]  mt-2 justify-center space-x-3 md:justify-between items-center bg-gray-300 md:space-x-2 lg:space-x-6 md:px-10 lg:px-32 rounded-lg">
              <div className="flex  md:space-x-10  w-1/3 h-full items-center">
                <GetImage name={match.avatarA} />
                <div className="font-mono font-semibold md:text-[20px]">{match.usernameA}</div>
              </div>
              <div className="flex w-1/5 md:w-[90px]    h-full items-center justify-between md:justify-center md:space-x-6 ">
                <div className={`font-bold text-lg ${match.scoreB > match.scoreA ? 'text-red-500' : 'text-green-600'}`}>{match.scoreA}</div>
                <div className="font-bold md:text-xl  md:uppercase">vs</div>
                <div className={`font-bold text-lg ${match.scoreA > match.scoreB ? 'text-red-500' : 'text-green-600'} `}>{match.scoreB}</div>

              </div>
              <div className="flex justify-around md:justify-between md:space-x-10  w-1/3 h-full items-center ">
                <div className="font-mono font-semibold md:text-[20px] ">{match.usernameB}</div>
                <div>
                  <GetImage name={match.avatarB} />

                </div>
              </div>

            </div>
            );
          }))}
        </div>

      </>
    );

  }
}



export function LeaderBord () {
  const context = useContext(MyContext);

  const GetPhoto = ({ name }: { name: string }) => {
    if (name === '0')
      return <Image className="mask mask-squircle w-16 h-16 md:w-20 md:h-20" src={avatar} alt="avatar" />
    else
      return <img className="mask mask-squircle w-14 h-14 md:w-16 md:h-16" src={name} alt="avatar" />

  }
  const GetPlace = ({rank } : {rank : number}) =>{
    if (rank === 1)
      return (
      <Image className=" pl-2 w-20 h-20 md:w-24 md:h-28" src={first} alt="av" />

      );
    else if (rank === 2)
    return (
      <Image className="pl-2 w-20 h-20 md:w-24 md:h-28" src={second} alt="av" />

      );
    else 
    return (
      <Image className=" pl-2 w-20 h-20 md:w-24 md:h-28 " src={third} alt="av" />

      );
   

  }


  return (
    <div className="w-full h-full">
      <div className="w-full h-[10%]"></div>
      <div className="  w-full h-[90%]  border-4 border-cyan-500 relative flex justify-center rounded-t-2xl ">
        <div className="absolute -top-10 w-[40%] h-[80px] bg-slate-100 border-4 border-cyan-400 flex justify-center text-3xl font-extrabold items-center rounded-2xl">LEADERBOARD</div>
        <div className="h-full w-full pt-16 px-2 pb-2">
          <div className="w-full h-full  flex flex-col px-3 gap-3">
            {
              context?.leaderBoard.map((leader : LeaderBoardType)=>{
               
                  return (
                    <div key={leader.rank} className={`w-full h-1/3  border-b-2 border-slate-400  flex gap-2 ${leader.rank === 1 ? 'pl-2' : 'pl-0'}`}>
                      <div className="w-[30%] h-full flex items-center  justify-around" >
                      <div>
                        <GetPlace rank={leader.rank} />
                        </div>
                        <div>
                          <GetPhoto name={leader.avatar} />

                      </div>

                      </div>


                      <div className="w-[70%] h-full flex items-center">
                      <div className="w-full bg-med  rounded-xl py-3 md:py-4 flex items-center justify-around ">
                      <div className=" text:lg md:text-2xl font-mono font-semibold text-white ">{leader.username}</div>
                          <div className="text-white text-lg md:text-2xl">{leader.lvl}</div>
                      </div>
                      </div>
                     
                      

                  </div>
                  );
              })
            }
           
           
            
          </div>
        </div>

      </div>

        
      </div>
  )

}


export function GetDataAchievement({achiev} : {achiev : AchievementType[]}) {
  
  if (achiev.length == 0) {
    return (
      <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono '>
        Not have Achievement yet
      </p>
    )
  }
  else {
    return (
      <div>
  
  <div className="mygrid items-start m-5 gap-4">
  {achiev.map((ach : AchievementType) => (
    <div key={ach.id} className="p-2 text-center rounded-lg shadow bg-green-200 flex flex-col items-center justify-around">
      <div className="flex items-center">
        <Award />
        {ach.title}
      </div>
      <div className="flex py-3  items-center">
        
        For: {ach.condition}
      </div>
      <div className="flex items-center">{ach.description}</div>
    </div>
  ))}
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
  const removeChat = (login: string) => {
    context?.setContactChat(prevcontact =>
      prevcontact.filter(chat => chat.login !== login))
  }

  const blockUser = (friend: FriendType) => {
    if (context?.token)
      checkIs7rag(context?.token);
    if (context?.socket)
      context?.socket.emit('block', {
        blockedLogin: friend.login,
        stillEnemy: true,
      })
    removefriend(friend.login);
    removeChat(friend.login);
    context?.setUserBlocked((prev) => [...prev, friend]);
  }

  useEffect(() => {
    // Fetch data and set it to the useState 'Data' here
    console.log('data');
  });


  const sendMsg = (login: string, username: string,) => {

    setName(username);
    setLogin(login);
    setIsModalOpen(true);

  }
  
  const deleteFriend = (friend: FriendType) => {
    if (context?.token)
      checkIs7rag(context?.token);
    context?.socket?.emit('removeFriend', { login: friend.login });
    removefriend(friend.login);
  }
  const viewProfile = (friend: FriendType) => {
    context?.setProfileuser(friend.login);
    console.log(friend.login);
    const getData = async () => {
      const res = await axios.post('http://localhost:5000/user/viewProfile',
        { login: friend.login },
        {
          headers: {
            Authorization: `Bearer ${context?.token} `

          }
        });
      console.log('this is res profile ', res.data.message);
      if (res.data.message)
        router.push(`http://localhost:3000/Profile/${friend.login}`)
      else
        console.log('this user is block you ');
    }
    getData();
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
            context?.friends.map((friend: FriendType) => {
              return (
                <div key={friend.login} className="h-[16%] max-h-[16%] bg-gray-200 flex justify-around items-center my-2" >
                  <ModalChat isOpen={isModalOpen} closeModal={closeModal} name={name} login={login} />
                  <div className="h-full w-1/3 flex justify-center items-center">
                    <GetImage name={friend.avatar} />
                  </div>
                  <div className="w-1/3 text-center">{friend.username}</div>
                  <div className="w-1/3 text-center z-20">
                    <div className="dropdown dropdown-left ">
                      <label tabIndex={0} className="btn btn-ghost btn-xs">details</label>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><button onClick={() => {
                          sendMsg(friend.login, friend.username);

                        }}>Send Msg</button></li>
                        <li><button onClick={() => viewProfile(friend)}>View Profile</button></li>
                        <li><button onClick={() => deleteFriend(friend)}>Delete</button></li>
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


const DatSend = () => {
  const context = useContext(MyContext)
  const rmv = (login: string) => {
    context?.setWaitToAccept(prev =>
      prev.filter(friend => friend.login !== login)
    );
  };



  const removeInvite = (login: string) => {
    if (context?.token)
      checkIs7rag(context?.token);
    context?.socket?.emit('removeInvite', { login: login });
    rmv(login);
    console.log(login);

  }
  if (context?.waitToAccept){
    if (context?.waitToAccept.length === 0) {
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
              context?.waitToAccept.map((friend: FriendType) => {
                return (
                  <div key={friend.login} className="h-[16%] max-h-[16%] bg-gray-200 flex justify-around items-center my-2" >
                    {/* <ModalChat  isOpen={isModalOpen} closeModal={closeModal} name={name} login={login}/> */}
                    <div className="h-full w-1/3 flex justify-center items-center">
                      <GetImage name={friend.avatar} />
                    </div>
                    <div className="w-1/3 text-center">{friend.username}</div>
                    <div className="w-1/3 text-center z-20">
                      <div className="dropdown dropdown-left ">
                        <button onClick={() => removeInvite(friend.login)} className="btn btn-ghost btn-xs">Remove Invite</button>
  
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
  else{
    return (
      <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono '>
        You are not Add any one

      </p>
    )
  }
}


const DataRecieved = () => {



  const context = useContext(MyContext);

  const removefriend = (login: string) => {
    context?.setPendingInvitation(prevChannels =>
      prevChannels.filter(channel => channel.login !== login)
    );
  };

  const AcceptFriend = (friend: FriendType) => {
    if (context?.token)
      checkIs7rag(context?.token);
    removefriend(friend.login)
    
    context?.socket?.emit('acceptFriend',
      {
        login: friend.login,
        accepte: true
      })
    context?.setFriends((prev) => [...prev, friend]);

    // console.log('accept friend')


  }

  const deleteinvit = (friend: FriendType) => {
    if (context?.token)
      checkIs7rag(context?.token);
    removefriend(friend.login)
    context?.socket?.emit('acceptFriend', {
      login: friend.login,
      accepte: false,
    })
    removefriend(friend.login);
  }


  if (context?.pendingInvitation){
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
            context?.pendingInvitation.map((friend: FriendType) => {
              return (
                <div key={friend.login} className="h-[16%] max-h-[16%] bg-gray-200 flex justify-around items-center my-2" >
                  <div className="h-full w-1/3 flex justify-center items-center">
                    <GetImage name={friend.avatar} />

                  </div>
                  <div className="w-1/3 text-center">{friend.username}</div>
                  <div className="w-1/3 text-center z-20">
                    <div className="dropdown dropdown-left ">
                      <label tabIndex={0} className="btn btn-ghost btn-xs">details</label>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><button onClick={() => AcceptFriend(friend)}>Accept</button></li>
                        <li><button onClick={() => deleteinvit(friend)}>Decline</button></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

    );}
    else{
      return (
        <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono '>
          You don't have any invitation
  
        </p>
      )

    }
}


const BlackList = () => {

  const context = useContext(MyContext);

  const rmv = (login: string) => {
    context?.setUserBlocked(prev =>
      prev.filter(friend => friend.login !== login)
    );
  };
  const removeBlock = (friend: FriendType) => {
    if (context?.token)
      checkIs7rag(context?.token);
    context?.socket?.emit('block', {
      blockedLogin: friend.login,
      stillEnemy: false,
    })
    rmv(friend.login);

  }
  if (context?.userBlocked){
    if (context?.userBlocked.length === 0)
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
              context?.userBlocked.map((friend: userBlockedType ) => {
                return (
                  <div key={friend.login} className="h-[16%] max-h-[16%] bg-gray-200 flex justify-around items-center my-2" >
                    <div className="h-full w-1/3 flex justify-center items-center">
                      <GetImage name={friend.avatar} />
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
  else{
    return (
        <p className=' text-center text-4xl mx-auto my-auto text-slate-700 font-semibold font-mono '>
          Black List is empty
        </p>
      )

  }
}





export { DatSend, DataRecieved, BlackList };