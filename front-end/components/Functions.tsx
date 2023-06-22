import GetDataHistory, {GetDataAchievement, GetDataFriend, DatSend, DataRecieved, BlackList} from '@/components/GetData';
import BarLeft from './BarLeft';
import { useContext } from 'react';
import { MyContext } from './Context';
import avatar from '../image/avatar.webp'
import Image from 'next/image';

interface PropsCallBarLeft{
  page : string;
}

export default function  Functions(){

}
export const GetAvatar = ({avat } : {avat : string | undefined}) =>{
  if (avat === '0')
    return (
      <Image src={avatar} alt="ava" />
    );
  else
      return (
        <img src={avat} alt="ava" />
      );
}



export function DataFunction (nbr : number){
  const context  = useContext(MyContext);
    return (
        (()=>{
            if (nbr == 1){
              if (context?.match)
              return <GetDataHistory matches={context?.match} />;
            }
            else if (nbr == 2){
              return <GetDataAchievement />
            }
            else if (nbr == 3){

              return <GetDataFriend />
            }
            else if (nbr == 4){
              return <DatSend />
            }
            else if (nbr == 5){
              return <DataRecieved />
            }
            else if (nbr == 6){
              console.log('black list');
              return <BlackList />
            }
            else{
              return <div></div>
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