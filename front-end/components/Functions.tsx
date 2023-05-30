

import GetDataHistory, {GetDataAchievement, GetDataFriend} from '@/components/GetData';
import BarLeft from './BarLeft';

interface PropsCallBarLeft{
  page : string;
}

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

export function CallBarLeft(props: PropsCallBarLeft){
    return (
        <>
            <BarLeft name="Profile" check={false} page={props.page}  />
            <BarLeft name="Chat" check={false} page={props.page}  /> 
            <BarLeft name="Game" check={false}  page={props.page}/>
            <BarLeft name="Setting" check={false} page={props.page}/>
            <BarLeft name="Logout" check={false} page={props.page}/> 
        </>
    );

}