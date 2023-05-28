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
    <div className='flex flex-col h-full overflow-y-auto relative scrollbar-thin scrollbar-thumb-green-400 scrollbar-w-1 scrollbar-track-slate-100'>
        <h2 className="text-lg font-medium m-6  underline decoration-sky-500">Search For a Contacts</h2>

      <ContactSearch />
        <h2 className="text-lg font-medium m-6 underline decoration-sky-500">Contacts</h2>
  
  
        <ul>
  {contacts.map((contact) => (
    <li className="flex items-center m-2 p-2 bg-gray-200 rounded-full" key={contact.id}>
      <Link href={contact.img}>
        <img className="w-10 h-10 rounded-full mr-3" src={contact.img} alt="" />
      </Link>
      <button onClick={() => handleClick(contact.id)}>
        <div className="flex-1">
          <h3 className="text-gray-900 font-medium hover:text-lg hover:text-rose-950">{contact.name}</h3>
        </div>
      </button>
    </li>
  ))}
</ul>

     
     </div>
    );
  }
