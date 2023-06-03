import { useState } from "react";
import Router from "next/router";
const Pop = () =>{
    const router = Router;
    const [modal , setModal] = useState('modal-toggle')
    const [hid, setHid] = useState('block')
    
    const click = () =>{
        if (hid === 'block')
            setHid('hidden')
        else if (hid === 'hidden')
            setHid('block')
        if (modal === 'modal-toggle')
            setModal('modal-show')
        else if (modal === 'modal-show')
            setModal('modal-toggle')
    }


    const Sing = ()=>{
        router.push('http://localhost:3000/Dashbord');
    }
    return (
        <div className="min-h-screen bg-slate-400 flex justify-center items-center">
                <button className={`bg-red-400 rounded-full ${hid}`} onClick={click}>modal</button>
                <div className={` ${modal}`}>
                <div className={`modal-box flex flex-col w-60 h-60`}>
                    <div className="w-full h-[70%]">
                    <p>
                        this is modal
                    </p>
                    <input type="text" placeholder="enter your name" />

                    </div>
                    <div className="w-full h-[30%] flex items-center justify-around">
                        <button onClick={Sing} className="bg-blue-300">sing in</button>
                        <button onClick={click}  className="bg-cyan-800">exit</button>
                    </div>
                    </div>
            </div>
        </div>
    );
}

export default Pop;