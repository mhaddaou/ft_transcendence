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
  usernameA: string;
  usernameB : string;
  winner: boolean;
  avatarA : string;
  avatarB: string;
}

export interface userSearchProps{
  avatar : string;
  login : string;
  username: string;
}
export interface channelSearchProps{
  avatar : string;
  channelName:string;
  isPrivate : boolean;
  ispassword : boolean;
  password : string;
}

export interface InfoChannelProp{
  ChannelId : string;
  LoginOwner: string;
  avatar: string;
  channelName : string;
  createdAt: string;
  isPrivate : boolean;
  ispassword: boolean;
}




export interface ChannelsType{
  avatar: string;
  channelName : string;
  
}

export interface FriendsType{
  
  loginA:  string;
  loginB:  string;
  avatar: string;
  username: string;
  isFriends:  boolean; 
}


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

export interface adminsChannelType{
  avatar: string;
  channelName : string;
  isAdmin: boolean;
  isBlacklist : boolean;
  isMute : boolean;
  isOwner : boolean;
  login : string;
  username: string;
}
export interface membersChannelType{
  avatar: string;
  channelName : string;
  isAdmin: boolean;
  isBlacklist : boolean;
  isMute : boolean;
  isOwner : boolean;
  login : string;
  username: string;
}


export interface MembersType{
  
  channelName : string;
  login : string;
  username: string;
  avatar: string;
  
}

export interface FriendType{
  login : string;
  username : string;
  avatar : string;
}

export interface profileType{
  username: string;
  avatar: string;
  matches : MatchType[];
}


export interface ContextTypes{
  profileuser : string;
  setProfileuser : Dispatch<SetStateAction<string>>;
  owner : boolean;
  setOwner : Dispatch<SetStateAction<boolean>>;
  admin : boolean;
  setAdmin : Dispatch<SetStateAction<boolean>>;
  adminsChannel : adminsChannelType[];
  setAdminChannel : Dispatch<SetStateAction<adminsChannelType[]>>;
  error : boolean;
  setError : Dispatch<SetStateAction<boolean>>;
  messageError : string;
  setMessageError : Dispatch<SetStateAction<string>>;
  membersChannel : MembersType[];
  setMembersChannel : Dispatch<SetStateAction<MembersType[]>>
  pendingInvitation : FriendType[];
  userSearch : userSearchProps[];
  setUserSearch : Dispatch<SetStateAction<userSearchProps[]>>;
  channelSearch : channelSearchProps[];
  setChannelSearch : Dispatch<SetStateAction<channelSearchProps[]>>;
  profile : profileType | undefined;
  setProfile : Dispatch<SetStateAction<profileType | undefined>>;
  setPendingInvitation : Dispatch<SetStateAction<FriendType[]>> // this is for pendining invitation to accept another (waitToAccept);
  waitToAccept : FriendType[]; // this is for waiting to another to accept you (pendingInvitation);
  setWaitToAccept : Dispatch<SetStateAction<FriendType[]>>;
  friends : FriendType[]; // this is array of friends;
  setFriends : Dispatch<SetStateAction<FriendType[]>>
  blackList : FriendType[];
  setBlackList : Dispatch<SetStateAction<FriendType[]>>
  channelInfo : InfoChannelProp | undefined;
  setChannelInfo : Dispatch<SetStateAction<InfoChannelProp | undefined>>;
  clickChannel : boolean;
  setClickChannel : Dispatch<SetStateAction<boolean>>;
  clickChat : boolean;
  setClickChat : Dispatch<SetStateAction<boolean>>;
  Channels : ChannelsType[];
  setChannels: Dispatch<SetStateAction<ChannelsType[]>>;
  enableTwoFa: boolean;
  setEnableTwofa: Dispatch<SetStateAction<boolean>>;
    chn : boolean;
    setChn : Dispatch<SetStateAction<boolean>>;
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
    const [owner, setOwner] = useState(false);
    const [profileuser, setProfileuser] = useState<string>('');
    const [admin, setAdmin] = useState(false);
    const [adminsChannel, setAdminChannel] = useState<adminsChannelType[]>([])
    const [membersChannel, setMembersChannel] = useState<MembersType[]>([])
    const [error, setError] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [profile, setProfile] = useState<profileType | undefined>(undefined)
    const [userSearch, setUserSearch] = useState<userSearchProps[]>([]);
    const [channelSearch, setChannelSearch] = useState<channelSearchProps[]>([]);
    const [blackList, setBlackList] = useState<FriendType[]>([])
    const [waitToAccept, setWaitToAccept] = useState<FriendType[]>([])
    const [pendingInvitation, setPendingInvitation] = useState<FriendType[]>([]);
    const [friends, setFriends] = useState<FriendType[]>([]);
    const [channelInfo, setChannelInfo] = useState<InfoChannelProp>()
    const [clickChannel, setClickChannel] = useState(false);
    const [clickChat, setClickChat] = useState(false);
    const [Channels, setChannels] = useState<ChannelsType[]>([]);
    const [enableTwoFa, setEnableTwofa] = useState(false);
    const [chn, setChn] = useState(false);
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
        const GetUserSearch = localStorage.getItem('userSearch');
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
        const GetChannels = localStorage.getItem('channels');
        const GetClickCha = localStorage.getItem('clickChannel');
        const GetWaitAccept = localStorage.getItem('waitAccept');
        const GetBlock = localStorage.getItem('blocked');
        const GetChannelSearch = localStorage.getItem('channelSearch');
        const GetMembers = localStorage.getItem('members');
        const GetAdmin = localStorage.getItem('admin');
        const GetProfileuser = localStorage.getItem('profileuser');
        if (GetProfileuser){
          setProfileuser(GetProfileuser);
        }
        if (GetAdmin)
          setAdmin(GetAdmin === "true");
        if (GetMembers !== undefined && GetMembers !== null && GetMembers !== 'undefined'){
          setMembersChannel(JSON.parse(GetMembers));
        }
        if (GetUserSearch !== undefined && GetUserSearch !== null && GetUserSearch !== "undefined") {
          setUserSearch(JSON.parse(GetUserSearch));
        } 
        if (GetChannelSearch !== undefined && GetChannelSearch != null && GetChannelSearch !== "undefined"){
            setChannelSearch(JSON.parse(GetChannelSearch));
          }
        if (GetBlock!== undefined && GetBlock!== null) {
          setBlackList(JSON.parse(GetBlock));
        }
        if (GetWaitAccept != undefined && GetWaitAccept !== null){
            setWaitToAccept(JSON.parse(GetWaitAccept));
        }
        const GetPending = localStorage.getItem('pending')
        if (GetPending !== undefined && GetPending != null){
          setPendingInvitation(JSON.parse(GetPending));
        }
        if (GetClickCha)
          setClickChannel(GetClickCha === "true");
        if (GetChannels !== undefined && GetChannels !== null){
          setChannels(JSON.parse(GetChannels));
        } 
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
  useEffect(() =>{
    localStorage.setItem('channels', JSON.stringify(Channels));
  }, [Channels])
  useEffect(() =>{
    localStorage.setItem('clickChannel', String(clickChannel));
  }, [clickChannel]);
  useEffect(() =>{
    localStorage.setItem('waitAccept', JSON.stringify(waitToAccept));

  },[waitToAccept])
  useEffect(() =>{
    localStorage.setItem('pending', JSON.stringify(pendingInvitation));

  },[pendingInvitation])
  useEffect(() =>{
    localStorage.setItem('blocked', JSON.stringify(blackList));
  },[blackList])
  useEffect(() =>{
    localStorage.setItem('profil', JSON.stringify(profile));
  },[profile])
  useEffect(() =>{
    localStorage.setItem('userSearch', JSON.stringify(userSearch));
  },[userSearch])
  useEffect(() =>{
    localStorage.setItem('channelSearch', JSON.stringify(channelSearch));
  },[channelSearch]);
  useEffect(() =>{
    localStorage.setItem('members', JSON.stringify(membersChannel));
  },[membersChannel])
  useEffect(() =>{
    localStorage.setItem('admin', String(admin));
  },[admin])
  useEffect(() =>{
    localStorage.setItem('profileuser', profileuser);
  },[profileuser])

  // context value
 
    const ContextValue = {name, setName, img, setImg, friends, setFriends,wins, setWins, losses, setLosses,  level, setLevel,LevlPer,setLevlPer,login, setLogin, checkname, 
      setCheckname,socket,setSocket, chatHistory,setChatHistory,showMsg, setShowMsg, check, setCheck, match, setMatch,token, setToken,blackList,adminsChannel, setAdminChannel, 
      setBlackList,error, setError, messageError, setMessageError, membersChannel, setMembersChannel,userSearch, setUserSearch,channelSearch, setChannelSearch,MessageContent, 
      waitToAccept,profile, setProfile, pendingInvitation, setPendingInvitation, setWaitToAccept, channelInfo, Channels,setClickChannel, setChannelInfo,clickChat, setClickChat,
      clickChannel, setChannels,owner, profileuser, setProfileuser,setOwner, admin, setAdmin, setMessageContent,contactChat, enableTwoFa, setEnableTwofa, setContactChat, MessageInfo, setMessageInfo , chn, setChn}

    return (
        <MyContext.Provider value={ContextValue}>
            {children}
        </MyContext.Provider>
    );

}

export {MyContext, MyContextProvider};