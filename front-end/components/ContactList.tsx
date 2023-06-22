import Link from 'next/link';
import ContactSearch from './ContactSearch';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { MyContext } from './Context';
import Avatar from '../image/avatar.webp';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import smia from '../image/smia.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { ModalCreateChannel } from './Modal';
import { ChannelsType } from './Context';






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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5000/chat/memberships',
          { login: context?.login },
          {
            headers: {
              Authorization: `Bearer ${context?.token}`,
            },
          }
        );
        // context?.setContactChat(res.data);
        context?.setChannels(res.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  


  
    
  
    function handleClick(login : string) {
      onContactClick(login, false);
    }
    function handleClickCh(ChannelName : string){
      onContactClick(ChannelName, true);
    }

    function GetImg(imge : string){
        if (imge === 'smia')
          return smia;
        else
          return Avatar;
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
    const closeModal = () => {
      setIsModalOpen(false);
    };
    

  
    return (
      
    // 
    <div className='flex w-full p-2 flex-col h-full '>
      {isModalOpen && <ModalCreateChannel isOpen={isModalOpen} closeModal={closeModal} />}
      
      <div className='w-full h-full rounded-lg  bg-gray-300 overflow-y-auto relative scrollbar-thin scrollbar-thumb-green-400 scrollbar-w-1 scrollbar-track-slate-100 '>
      <div className='h-[3%] w-[95%] flex justify-end items-center '>
      <div className="dropdown dropdown-end">
        <button  tabIndex={0}>
          <FontAwesomeIcon className='pt-1 h-5' icon={faEllipsisVertical} />
        </button>

        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-">
          <li><button onClick={openModal} >Create Channel</button></li>

        </ul>
      </div>

      </div>
      
      <div className='h-[97%] w-full p-2 '>
        <div className='w-full h-1/2 overflow-y-auto flex flex-col'>
          <div className='  text-center border-b-2 font-mono font-semibold w-full h-[10%]'>Channels</div>
          <div className='w-full h-[90%] overflow-y-auto pt-3'>
          {context?.Channels.map((channel : ChannelsType) => (
            <button onClick={() => handleClickCh(channel.channelName)} className=" flex flex-col h-14 bg-slate-200 mb-1 w-full px-2 rounded-lg" >
              <div className='flex flex-row items-center p-2 space-x-2'>
              {
                (() =>{
                  if (channel.avatar.length < 5)
                    return <Image src={GetImg(channel.avatar)} className="w-10 h-10 rounded-full mr-3" alt="dklfj" width={200} height={200}/>
                  else
                    return <img className="w-10 h-10 rounded-full mr-3" src={channel.avatar} alt='avatar' width={200} height={200}/>
                }) ()
                

              }
                
                <h3 className="text-gray-900 font-medium ">{channel.channelName}</h3>
              </div>
            </button>
          ))}
        
          </div>
        
        </div>
        <div className='w-full h-1/2 '>
        <div className='  text-center border-b-2 font-mono font-semibold w-full h-[10%]'>Contacts</div>
          <div className='w-full h-[90%] overflow-y-auto pt-3'> 
                {context?.contactChat.map((contact) => (
                      <button onClick={() => handleClick(contact.login)} className=" flex flex-col h-14 bg-slate-200 mb-1 w-full px-2 rounded-lg" >
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
      

      </div>

      </div>

     
     </div>
    );
  }
