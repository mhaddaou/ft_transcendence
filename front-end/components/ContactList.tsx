import Link from 'next/link';
import ContactSearch from './ContactSearch';
import { useState } from 'react';
import axios from 'axios';

export default function ContactList({  onContactClick } : any) {
    const contacts = [
      { id: 1, name: 'Alice' ,img: "https://cdn.intra.42.fr/users/0b44db41c0aff8300d8d24f0717cc7da/smia.jpg",},
      { id: 2, name: 'Bob',img: "https://cdn.intra.42.fr/users/d4d754cbf571f0b52778dfedbd79de0f/mhaddaou.jpg", },
      { id: 3, name: 'Charlie',img: "https://cdn.intra.42.fr/users/d4d754cbf571f0b52778dfedbd79de0f/mhaddaou.jpg", },
      { id: 4, name: 'Charlie',img: "https://cdn.intra.42.fr/users/d4d754cbf571f0b52778dfedbd79de0f/mhaddaou.jpg", },
      { id: 5, name: 'Charlie',img: "https://cdn.intra.42.fr/users/d4d754cbf571f0b52778dfedbd79de0f/mhaddaou.jpg", },
      { id: 6, name: 'Charlie',img: "https://cdn.intra.42.fr/users/d4d754cbf571f0b52778dfedbd79de0f/mhaddaou.jpg", },
      { id: 7, name: 'Charlie',img: "https://cdn.intra.42.fr/users/d4d754cbf571f0b52778dfedbd79de0f/mhaddaou.jpg", },
      { id: 8, name: 'Charlie',img: "https://cdn.intra.42.fr/users/d4d754cbf571f0b52778dfedbd79de0f/mhaddaou.jpg", },
      { id: 8, name: 'Charlie',img: "https://cdn.intra.42.fr/users/d4d754cbf571f0b52778dfedbd79de0f/mhaddaou.jpg", },
      { id: 8, name: 'Charlie',img: "https://cdn.intra.42.fr/users/d4d754cbf571f0b52778dfedbd79de0f/mhaddaou.jpg", },
      { id: 8, name: 'Charlie',img: "https://cdn.intra.42.fr/users/d4d754cbf571f0b52778dfedbd79de0f/mhaddaou.jpg", },
    ];
  
    function handleClick(contactId : any) {
      onContactClick(contactId);
    }
  
    return (
      
    // 
    <div className='flex w-full flex-col h-full overflow-y-auto relative scrollbar-thin scrollbar-thumb-green-400 scrollbar-w-1 scrollbar-track-slate-100 '>
      <div className='h-[8%] flex justify-center items-center'>
          <h2 className="text-lg   border-b-2 rounded-b-lg border-slate-500 font-mono font-semibold">Contact List</h2>
      </div>
      <div className='h-[92%] w-full px-2 '>

      {contacts.map((contact) => (
            <button onClick={() => handleClick(contact.id)} className=" flex flex-col h-14 bg-gray-300 mb-1 w-full px-2 rounded-lg" key={contact.id}>
              <div className='flex flex-row items-center p-2 space-x-2'>
                <img className="w-10 h-10 rounded-full mr-3" src={contact.img} alt="" />
                <h3 className="text-gray-900 font-medium ">{contact.name}</h3>
              </div>
            </button>
          ))}
      </div>
  
  
  

     
     </div>
    );
  }
