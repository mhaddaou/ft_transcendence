import Head from 'next/head'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from "react";
const { log } = console;
import { MatterJsModules } from '../utils/MatterJsModules'
import { MyContext } from '@/components/Context';
import { io } from "socket.io-client"
import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";
import { ChevronLeft, ChevronRight } from 'react-feather'

import { ModalGame } from '@/components/Modal';

import { useRouter } from 'next/router';
import { checkIs7rag } from '@/components/Functions';
import createSocketConnection from '@/components/socketConnection';

// const inter = Inter({ subsets: ['latin'] })
// var token : string | null = null;

export default function Game() {
  const context = useContext(MyContext);

  const router = useRouter();
  const [joinRoom, setJoinRoom] = useState<string>("hidden")
  const [roomName, setRoomName] = useState<string>("")
  const [height, setHeight] = useState<number>(400)
  const [score, setScore] = useState({ left: 0, right: 0 })
  const [players, setPlayers] = useState({ p1: "player1", p2: "player2" })
  const [countDown, setCountDown] = useState(5);
  const [animations, setAnimations] = useState(1)
  const [matterjsInstance, setMatterjsInstance] = useState<MatterJsModules | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winner, setWinner] = useState('')
  const [gameStatus, setGameStatus] = useState(false)
  const [gameStatusMsg, setGameStatusMsg] = useState("Waiting for a player to join...")
  const [restart, setRestart] = useState(false)
  const [theme, setTheme] = useState(0)
  useEffect(() => {
    const getT = localStorage.getItem('token');
    if (!getT)
      router.push('/');
  }, [])
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleRoomName = (e: any) => {
    setRoomName(e.target.value)
  }
  const handleResize = () => {
    setHeight(window.innerWidth); // Update the width based on the window size
  };
  const themes = [{
    leftP: "#6DA9E4",
    rightP: "#F6BA6F",
    wall: "#FFEBEB",
    ball: "black",
    background: "#ADE4DB",
  },
  {
    leftP: "#98EECC",
    rightP: "#FBFFDC",
    wall: "#A4907C",
    ball: "#884A39",
    background: "#F9E0BB",
  },
  {
    leftP: "#FF78C4",
    rightP: "#9376E0",
    wall: "#F79327",
    ball: "red",
    background: "#F6FA70",
  },
  {
    leftP: "#ffffff",
    rightP: "gray",
    wall: "#F5F5F5",
    ball: "orange",
    background: "#000000",
  }
  ]
  const divStyle = {
    height: `${height}px`,
    backgroundColor: `${themes[theme].background}`
  };
  const handleReplay = () => {
    closeModal()
    setRestart(true)
  }

  useEffect(() => {
    if (context?.token) {
      var socket = io(`${process.env.Socket}`, {
        extraHeaders: {
          Authorization: context?.token,
        }
      });
      socket.on('message', (payload: any) => {
        // SetToMessages(payload);
        // setMessages([...messages, payload]);
      });

      context.setSocket(socket);

    }
  }, [context?.token]);


  useEffect(() => {
    if (matterjsInstance && matterjsInstance.socket && !gameStatus && gameStatusMsg == "Host left the game..") {
      console.log("host left the game emiting")
      matterjsInstance.socket.emit('gameDisconnection', 'host left');
      matterjsInstance.socket.off("paddleAssigned")
      matterjsInstance.socket.off("right")
      matterjsInstance.socket.off("left")
      matterjsInstance.socket.off("score")
      matterjsInstance.socket.off("gameOver")
      matterjsInstance.socket.off("restart")
      matterjsInstance.socket.off("ready")
      matterjsInstance.socket.off("gameStatus")
      matterjsInstance.socket.off("cancelGame")
      matterjsInstance.socket.disconnect()
    }
  }, [gameStatus, gameStatusMsg])

  useEffect(() => {


    const handleLeavePage = () => {
      if (context?.token)
        checkIs7rag(context?.token);
      if (matterjsInstance && matterjsInstance.socket) {
        matterjsInstance.socket.emit('gameDisconnection', 'User has navigated from the page');
      }
    }

    router.events.on('beforeHistoryChange', handleLeavePage);


  });

  useEffect(() => {

    if (matterjsInstance) {

      matterjsInstance.bodies.ball.render.fillStyle = themes[theme].ball
      matterjsInstance.bodies.circleA.render.fillStyle = themes[theme].wall
      matterjsInstance.bodies.circleB.render.fillStyle = themes[theme].background
      matterjsInstance.bodies.circleC.render.fillStyle = themes[theme].wall
      matterjsInstance.bodies.centerLine.render.fillStyle = themes[theme].wall
      matterjsInstance.bodies.leftPaddle.render.fillStyle = themes[theme].leftP
      matterjsInstance.bodies.rightPaddle.render.fillStyle = themes[theme].rightP
      matterjsInstance.bodies.wall.render.fillStyle = themes[theme].wall
      matterjsInstance.bodies.wallLeft.render.fillStyle = themes[theme].wall


    }
  }, [theme])

  useEffect(() => {

    if (countDown <= 4) {

      const timer = setTimeout(() => {

        setCountDown(countDown + 1);
        setAnimations(animations + 1)
        if (countDown == 2)
          setAnimations(animations + 2)
      }, 1000); // Example: Increment count every 2 seconds

      return () => clearTimeout(timer);
    }

  }, [countDown]);



  useEffect(() => {
    const matterContainer = document.querySelector("#matter-Container") as HTMLElement
    if (matterContainer)
      setHeight(matterContainer.clientWidth * 16 / 9)
    const handleResize = () => {

      setHeight(matterContainer?.clientWidth * 16 / 9); // Update the width based on the window size
    };

    window.addEventListener('resize', handleResize);


    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, [context?.socket]);
  useEffect(() => {
    matterjsInstance?.onWindowSizeChange()

  }, [height])


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setJoinRoom("go")
      const { room, queue } = router.query;
      log("this is the query", room, queue)
      if (room && queue) {
        const openQueue = queue === "true" ? true : false
        const MatterNode = new MatterJsModules(`${room}`, openQueue, context?.socket)
        setMatterjsInstance(MatterNode)
        MatterNode.gameStatusListener(setGameStatus, setGameStatusMsg)
        MatterNode.createModules()
        MatterNode.createBodies()
        MatterNode.events()
        MatterNode.run()
        MatterNode.socketStuff()
        MatterNode.updateGameScore(setScore, setCountDown, setPlayers)
        MatterNode.gameOverListener(setIsModalOpen, setWinner)
        MatterNode.restartGameListener(setIsModalOpen)
      }
    }, 1000); // 2000 milliseconds = 2 seconds

    return () => {
      // Clean up the timeout when the component unmounts or the effect re-runs
      clearTimeout(timeoutId);
    };

  }, [context?.socket, router.query]); // Empty dependency array to run the effect only once




  useEffect(() => {
    if (restart) {
      matterjsInstance?.restartMatch(setWinner, setRestart)
    }

  }, [restart])

  useEffect(() => {
    if (!winner.length)
      setIsModalOpen(!gameStatus);
  }, [gameStatus])





  if (context?.token) {
    return (
      <>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
            <div className="container w-full mx-auto h-screen min-h-[1024px] flex flex-row py-2 gap-2">
              <Barl page="Game" />
              <div className="w-full h-full relative rounded-2xl flex flex-col  gap-2 ">
                <NavBar page="Game" />

                {isModalOpen && <ModalGame isOpen={isModalOpen} closeModal={handleReplay} title={gameStatus ? "WINNER" : ""} msg={gameStatus ? winner : gameStatusMsg} color='bg-white' />}
                {
                  <div className="relative flex justify-center items-center flex-col">
                    <div className='flex rounded p-1  mb-2  bg-[white]  gap-2'>
                      <ChevronLeft className="cursor-pointer hover:text-[purple]" onClick={() => { setTheme(theme - 1 < 0 ? themes.length - 1 : theme - 1) }} />
                      <div>Themes</div>
                      <ChevronRight className="cursor-pointer hover:text-[purple]" onClick={() => { setTheme(theme + 1 >= themes.length ? 0 : theme + 1) }} />
                    </div>
                    <div className="relative h-[50px] w-[375px] rounded-t flex items-center border-double border-4 border-black  bg-[#9575DE]">
                      <div className='absolute left-5 flex flex-col items-center justify-center'>
                        <span className="text-white font-semibold"> {players.p1} </span>
                        <span className="text-white"> {score.left}</span>
                      </div>
                      <div className='absolute right-5 flex flex-col items-center justify-center'>
                        <span className="text-white font-semibold"> {players.p2} </span>
                        <span className="text-white">{score.right}</span>
                      </div>
                    </div>
                    <div id="matter-Container" style={divStyle} className={` border-8 border-black rounded w-full max-w-[623px] bg-[${themes[theme].background}] !important ${!joinRoom && "hidden"}`}>  </div>
                    {
                      countDown <= 4 &&
                      <div className="absolute text-white text-xl "
                        style={{ animationName: 'fadeout, growup', animationDuration: '1s', animationIterationCount: `${animations}` }}>
                        {countDown == 4 ? 'GO' : countDown}
                      </div>
                    }

                  </div>
                }
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

}