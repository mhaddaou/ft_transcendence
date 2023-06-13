import Link from 'next/link';
import ContactSearch from './ContactSearch';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { MyContext } from './Context';
import Avatar from '../image/avatar.webp';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import smia from '../image/smia.jpg'






export default function ContactList({  onContactClick } : any) {
  const context = useContext(MyContext);
  const [img, setImg] = useState<StaticImageData | string>('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5000/chat/conversations',
          { login: context?.login },
          {
            headers: {
              Authorization: `Bearer ${context?.token}`,
            },
          }
        );
        context?.setContactChat(res.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  


  
    
  
    function handleClick(login : string) {
      console.log(login);
      onContactClick(login);
    }

    function GetImg(imge : string){
        if (imge === 'smia')
          return smia;
        else
          return Avatar;
    }
    

  
    return (
      
    // 
    <div className='flex w-full flex-col h-full overflow-y-auto relative scrollbar-thin scrollbar-thumb-green-400 scrollbar-w-1 scrollbar-track-slate-100 '>
      <div className='h-[8%] flex justify-center items-center'>
          <h2 className="text-lg   border-b-2 rounded-b-lg border-slate-500 font-mono font-semibold">Contact List</h2>
      </div>
      <div className='h-[92%] w-full px-2 '>

      {context?.contactChat.map((contact) => (
            <button onClick={() => handleClick(contact.login)} className=" flex flex-col h-14 bg-gray-300 mb-1 w-full px-2 rounded-lg" >
              <div className='flex flex-row items-center p-2 space-x-2'>
              {
                (() =>{
                  if (contact.avatar.length < 5)
                    return <Image src={GetImg(contact.avatar)} className="w-10 h-10 rounded-full mr-3" alt="dklfj" width={200} height={200}/>
                  else
                    return <img className="w-10 h-10 rounded-full mr-3" src={contact.avatar} alt='avatar' width={200} height={200}/>
                }) ()
                

              }
                
                <h3 className="text-gray-900 font-medium ">{contact.username}</h3>
              </div>
            </button>
          ))}
      </div>

     
     </div>
    );
  }
