import Link from 'next/link';
import mhaddaou from '../image/mhaddaou.jpg'
import Image from 'next/image';
import { subscribe } from 'diagnostics_channel';
import { useEffect, useState, useContext } from 'react';
import { MyContext } from './Context';

const InfoContact = () =>{
    return (
        <div >

<label htmlFor="my_modal_6" className="btn flex text-center bg-transparent border-transparent  border-none text-slate-600 hover:bg-slate-300">Info</label>
<input type="checkbox" id="my_modal_6" className="modal-toggle" />
<div className="modal">
  <div className="modal-box">
    <div className='w-full h-full  flex flex-col gap-4 items-center'>
     <h3 className="font-bold text-lg text-center mb-4">Mhaddaou</h3>
     <Image className='rounded-3xl' src={mhaddaou} alt='avatar' />
     <Link className="py-4  " href="#">
      <p className='text-center  bg-slate-400 px-4 py-2 rounded-full text-white font-semibold hover:bg-slate-200 
                    hover:text-black hover:border-2 hover:border-slate-700'>Details</p>
    </Link>

    </div>
    <div className="modal-action">
      <label htmlFor="my_modal_6" className="btn bg-slate-400 border-slate-500">Close!</label>
    </div>
  </div>
</div>
</div>
    );
}
const SubmitName = () =>{
  const context = useContext(MyContext);
  const [check, setcheck] = useState('hidden');
  useEffect(() =>{
    if (context?.checkname){
      if (context?.checkname == 0)
        setcheck('hidden');
      else{
        setcheck('block');
      }
    }


  },[context?.checkname])
  
 
  return (
    <div >


      <div className={`${check}`}>
        <div className=' absolute top-[600px] modal-box w-full h-60 bg-green-300   flex flex-col gap-4 items-center'>
          <div className='w-full h-[80%] flex flex-col justify-center'>
          <h3 className="font-bold text-lg text-center mb-4 ">Success</h3>
          <p className='text-center'>your name is change successfuly</p>
          </div>
          <div className=' w-full flex justify-end items-end'>
            <button onClick={() =>{
              setcheck('hidden');
            }} className='bg-white py-2 px-4  rounded-md self-end font-light'>close</button>
          </div>
        
         
    
        </div>
        </div>

    </div>
  );


}


export default InfoContact;
export {SubmitName};