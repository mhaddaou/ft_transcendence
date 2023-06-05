import React, {useState, useContext, createContext, Dispatch, SetStateAction, ReactNode, useEffect} from "react";
import { StaticImageData } from "next/image";
import avatar from '../image/avatar.webp';

// define types context

export interface ContextTypes{
    name : string;
    setName : Dispatch<SetStateAction<string>>
    img : string;
    setImg : Dispatch<SetStateAction<string>>;
    friends : string[];
    setFriends : Dispatch<SetStateAction<string[]>>
    level : number;
    setLevel : Dispatch<SetStateAction<number>>;
    wins : number;
    setWins : Dispatch<SetStateAction<number>>;
    losses : number;
    setLosses : Dispatch<SetStateAction<number>>
}

// types childer
interface ChildProps{
    children : ReactNode;
}

// create context
const MyContext = createContext<ContextTypes | undefined>(undefined);

// create provider

const MyContextProvider = ({children} : ChildProps) =>{
    const [name, setName] = useState('');
    const [img, setImg] = useState('0');
    const [friends, setFriends] = useState<string[]>([]);
    const [level, setLevel] = useState(0);
    const [wins, setWins] = useState(0);
    const [losses, setLoss] = useState(0);
    // load data from localstorage
    useEffect(()=>{
        const getname = localStorage.getItem('name');
        const getimg = localStorage.getItem('img');
        const getfriends = localStorage.getItem('friends');
        const getlevel = localStorage.getItem('level');
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
          
          
    },[]);

// store data to localstorage
    useEffect(()=>{
        localStorage.setItem('name', name);
        console.log("the name is changed to " + name);
    },[name]);
    useEffect(()=>{
        localStorage.setItem('img', img);
        console.log()
    },[img]);
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
    const ContextValue = {name, setName, img, setImg, friends, setFriends};



    return (
        <MyContext.Provider value={{name, setName, img, setImg, friends, setFriends}}>
            {children}
        </MyContext.Provider>
    );

}

export {MyContext, MyContextProvider};
