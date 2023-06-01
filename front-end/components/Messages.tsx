
import Image from "next/image";
import smia from '../image/smia.jpg'
import mhaddaou from '../image/mhaddaou.jpg'

const Reciever = () =>{
    return (
        <div className="chat chat-end px-6">
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <Image src={mhaddaou} alt="av" />
            </div>
        </div>
        <div className="chat-bubble chat-bubble-accent bg-slate-200">afen</div>
        </div>
    );
}


const Sender = () =>{
    return (
        <div className="chat chat-start px-6">
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <Image src={smia} alt="av" />
            </div>
        </div>
        <div className="chat-header">
        </div>
        <div className="chat-bubble">hello </div>
        </div>
    );
}


const Messages = () =>{
    return (
        <div className="w-full rounded border-y-2 border-slate-600  pt-4 h-[96%] bg-blue-00">
            <Sender />     
            <Reciever />
        </div>
    );
}

export default Messages;