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
                <div className={`modal-box flex flex-col w-[400px] h-[500px]`}>
                    <div className="w-full h-[70%] flex flex-col gap-4 ">
                        <div className="text-center font-mono font-semibold">login</div>
                        <div className=" w-full h-full flex flex-col ">
                            <div className="h-1/2 w-full text-center">
                                <p>userName</p>
                                <input type="text" className="border-none" placeholder="enter your name" />
                            </div>
                            <div className="h-1/2 w-full text-center">
                                <p>Password</p>
                                <input type="password"  placeholder="enter your password"/>
                            </div>

                        </div>

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