import React, {useState, useContext, createContext, Dispatch, SetStateAction, ReactNode, useEffect, use} from "react";
import { StaticImageData } from "next/image";
import avatar from '../image/avatar.webp';
import { Socket } from "socket.io-client";

// define types context
const r : File | string = '';

export interface MatchType {
  
  loginA: string;
  loginB: string;
  scoreA: number;
  scoreB: number;
  username: string;
  winner: boolean;
  avatar: string;
}
export interface FriendsType{
  
  loginA:  string;
  loginB:  string;
  avatar: string;
  username: string;
  isFriends:  boolean; 
}

// {
//   "MsgId": "0754569a-096b-4d46-ab52-e27944f987bc",
//   "content": "nice",
//   "sendAt": "2023-06-14T22:34:26.115Z",
//   "loginSender": "mhaddaou",
//   "loginReceiver": "oqatim",
//   "fromUserA": false,
//   "conversationId": "246f1601-209a-4124-97b4-fab685aac47b"
// }
export interface MesgType{
  content : string;
  sendAt: string;
  loginSender: string;
  loginReceiver: string;
  fromUserA: boolean;
}

export interface msgPropType{
  avatarA: string;
  avatarB: string;
  loginA: string;
  loginB: string;
  usernameA: string;
  usernameB: string;
}
export interface ContaType{ // for contact chat
  username: string;
  login : string;
  avatar: string;
}

// export class Messages {
//   msginfo: msgPropType[] = [];
//   msgContent: MesgType[] = [];

//   addMsg(newMsg: MesgType) {
//     this.msginfo.push(newMsg);
//   }
// }


export interface ContextTypes{
    MessageContent : MesgType[] ; // Messages between you and others
    setMessageContent: Dispatch<SetStateAction<MesgType[]>>; // to add new messages to old messages
    MessageInfo : msgPropType | undefined; // to check the information messages
    setMessageInfo: Dispatch<SetStateAction<msgPropType | undefined>>; // to set THE information messages
    contactChat : ContaType[]; // this for contact chat
    setContactChat : Dispatch<SetStateAction<ContaType[]>> // update contact chat
    name : string;
    setName : Dispatch<SetStateAction<string>>
    login : string;
    setLogin : Dispatch<SetStateAction<string>>
    socket : Socket | undefined;
    setSocket : Dispatch<SetStateAction<Socket | undefined>>;
    token : string ;
    setToken : Dispatch<SetStateAction<string>>;
    img : string ;
    setImg : Dispatch<SetStateAction<string>>;
    friends : FriendsType[];
    setFriends : Dispatch<SetStateAction<FriendsType[]>>
    level : number;
    setLevel : Dispatch<SetStateAction<number>>;
    wins : number;
    setWins : Dispatch<SetStateAction<number>>;
    losses : number;
    setLosses : Dispatch<SetStateAction<number>>
    LevlPer : number;
    setLevlPer : Dispatch<SetStateAction<number>>;
    chatHistory : number;
    setChatHistory : Dispatch<SetStateAction<number>>
    showMsg : string;
    setShowMsg : Dispatch<SetStateAction<string>>
    check : number;
    setCheck : Dispatch<SetStateAction<number>>
    match : MatchType[] ;
    setMatch : Dispatch<SetStateAction<MatchType[]>>;
    checkname : number;
    setCheckname : Dispatch<SetStateAction<number>>;
}

// types childer
interface ChildProps{
    children : ReactNode;
}

// create context
const MyContext = createContext<ContextTypes | undefined>(undefined);

// create provider

const MyContextProvider = ({children} : ChildProps) =>{
  const [MessageContent, setMessageContent] = useState<MesgType[]>([]);
  const [MessageInfo, setMessageInfo] = useState<msgPropType>();
  const [contactChat, setContactChat] = useState<ContaType[]>([]);
  const [login, setLogin] = useState('');
    const [checkname, setCheckname] = useState(0);
    const [check, setCheck] = useState(0);
    const [token, setToken] = useState('');
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const [name, setName] = useState('');
    const [img, setImg] = useState<string>('0');
    const [friends, setFriends] = useState<FriendsType[]>([]);
    const [level, setLevel] = useState(0);
    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);
    const [LevlPer,setLevlPer ] = useState(0);
    const [chatHistory,setChatHistory ] = useState(0);
    const [showMsg, setShowMsg] = useState('block');
    const [match, setMatch] = useState<MatchType[]>([]);

      // load data from localstorage
      useEffect(()=>{
        const getname = localStorage.getItem('name');
        const getimg = localStorage.getItem('img');
        const getfriends = localStorage.getItem('friends');
        const getlevel = localStorage.getItem('level');
        const getwins = localStorage.getItem('wins');
        const getlosses = localStorage.getItem('losses');
        const getlevelper = localStorage.getItem('levelPer');
        const getchatHistory = localStorage.getItem('chatHistory');
        const getshowMsg = localStorage.getItem('showchat');
        const getMatch  = localStorage.getItem('match');
        const getToken = localStorage.getItem('token');
        const getCheckName = localStorage.getItem('checkName');
        const getLogin = localStorage.getItem('login');
        const getMessage = localStorage.getItem('message');
        const GetContaChat = localStorage.getItem('contactchat');
        if (GetContaChat!== undefined && GetContaChat !== null){
          try{
            setContactChat(JSON.parse(GetContaChat));
          }catch(e){
            console.error(e);
          }

        }
        else{
          console.error("the contact chat is not available or null or undefined");
        }
        if (getLogin) setLogin(getLogin);
        if (getCheckName) setCheckname(+getCheckName);
        if (getToken) setToken(getToken); 
      //   if (getMessage !== undefined && getMessage !== null){
      //     try{
      //       setMessage(JSON.parse(getMessage));

      //     }catch(err){
      //       console.log(err);
      //   }
      // }
      // else{
      //   console.log("messages is undefined or null");
      // }
        if (getMatch !== undefined && getMatch !== null) {
          try {
            setMatch(JSON.parse(getMatch));
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        } else {
          console.warn("getfriends is undefined or null");
        }
        if (getname) setName(getname);
        if (getimg) setImg(getimg);
        if (getfriends !== undefined && getfriends !== null) {
            try {
              setFriends(JSON.parse(getfriends));
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          } else {
            console.warn("getfriends is undefined or null");
          }
        if (getlevel)
          setLevel(+getlevel)
        if (getwins)
          setWins(+getwins);
        if (getlosses)
          setLosses(+getlosses);
        if (getlevelper)
          setLevlPer(+getlevelper);
        if (getchatHistory)
          setChatHistory(+getchatHistory);
        if (getshowMsg) 
          setShowMsg(getshowMsg);
    },[]);

    //storing information
    useEffect(()=>{
      localStorage.setItem('name', name);
      console.log("the name is changed to " + name);
  },[name]);
  useEffect(() =>{
    localStorage.setItem('contactchat', JSON.stringify(contactChat));

  },[contactChat])
  useEffect(()=>{
      localStorage.setItem('img', img.toString());
      console.log()
  },[img]);
  useEffect(() =>{
      localStorage.setItem('checkName',checkname.toString() )

  },[checkname])
  useEffect(()=>{
      localStorage.setItem('friends', JSON.stringify(friends));
  },[friends]);
  useEffect(() =>{
      localStorage.setItem('level', level.toString());

  },[level])
  useEffect(()=>{
      localStorage.setItem('wins', wins.toString());
  },[wins]);
  useEffect(()=>{
      localStorage.setItem('losses', losses.toString());
  },[losses]);
  useEffect(()=>{
      localStorage.setItem('levelPer', LevlPer.toString())
  },[LevlPer])
  useEffect(() =>{
    localStorage.setItem('chatHistory', chatHistory.toString());
  },[chatHistory])
  useEffect(() =>{
    localStorage.setItem('showMsg', showMsg);
  },[showMsg]);
  useEffect(() =>{
    localStorage.setItem('match', JSON.stringify(match));
  },[match])
  useEffect(()=>{
    localStorage.setItem('token', token);
  },[token])
  useEffect(() =>{
    localStorage.setItem('login', login);
  }, [login]);
  // useEffect(() =>{
  //   localStorage.setItem('message', JSON.stringify(Message));

  // }, [Message]);
 
    const ContextValue = {name, setName, img, setImg, friends, setFriends,wins, setWins, losses, 
      setLosses,  level, setLevel,LevlPer,setLevlPer,login, setLogin, checkname, setCheckname,socket,setSocket, chatHistory,setChatHistory,showMsg, setShowMsg, check, setCheck, match, setMatch
      ,token, setToken, MessageContent,setMessageContent,contactChat, setContactChat, MessageInfo, setMessageInfo };



    return (
        <MyContext.Provider value={ContextValue}>
            {children}
        </MyContext.Provider>
    );

}

export {MyContext, MyContextProvider};
