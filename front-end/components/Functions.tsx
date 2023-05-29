

import GetDataHistory, {GetDataAchievement, GetDataFriend} from '@/components/GetData';
import BarLeft from './BarLeft';


export default function  Functions(){

}

export function DataFunction (nbr : number){
    return (
        (()=>{
            if (nbr == 1){
              return <GetDataHistory  />;
            }
            else if (nbr == 2){
              return <GetDataAchievement />
            }
            else if (nbr == 3){
              return <GetDataFriend />
            }
            else{
              return(
                <div></div>
              );
            }
          })()
    )
}

export function CallBarLeft(){
    return (
        <>
            <BarLeft name="Chat" check={false} />
            <BarLeft name="Game" check={false} />
            <BarLeft name="Setting" check={false} />
            <BarLeft name="Log out" check={false}/>
        </>
    );

}