import Lottie from "lottie-react";
import ChatHistory from "./ChatHistory";
import anim from '../image/chatanim.json'
import ChannelHistor from "./ChannelHistory";
import { MesgType } from "./Context";
import { msgChannel } from "./ChannelHistory";
interface HIstoryType{
    history : any;
    check : string;
    id : string;
}


const History = (props : HIstoryType) =>{

    if (props.check === 'chat')
        return <ChatHistory chatHistory={props.history} login={props.id} />
    if (props.check === 'channel')
        return <ChannelHistor history={props.history} id={props.id} />
    else{
        return (
            <div className=" w-full h-full flex justify-center">
                <Lottie  animationData={anim}  /> 

            </div>

        );
    }
    
}

export default History;