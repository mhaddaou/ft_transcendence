import React, {useState, useContext, createContext, Dispatch, SetStateAction, ReactNode, useEffect} from "react";
import { StaticImageData } from "next/image";
import avatar from '../image/avatar.webp';

// define types context

interface ContextTypes{
    name : string;
    setName : Dispatch<SetStateAction<string>>
    img : string;
    setImg : Dispatch<SetStateAction<string>>;
    friends : string[];
    setFriends : Dispatch<SetStateAction<string[]>>
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
    // load data from localstorage
    useEffect(()=>{
        const getname = localStorage.getItem('name');
        const getimg = localStorage.getItem('img');
        const getfriends = localStorage.getItem('friends');

        if (getname) setName(getname);
        if (getimg) setImg(getimg);
        if (getfriends) setFriends(JSON.parse(getfriends));
    },[]);

// store data to localstorage
    useEffect(()=>{
        localStorage.setItem('name', name);
    },[name]);
    useEffect(()=>{
        localStorage.setItem('img', img);
    },[img]);
    useEffect(()=>{
        localStorage.setItem('friends', JSON.stringify(friends));
    },[friends]);

    const ContextValue = {name, setName, img, setImg, friends, setFriends};



    return (
        <MyContext.Provider value={ContextValue}>
            {children}
        </MyContext.Provider>
    );

}

export {MyContext, MyContextProvider};
