import mhaddaou from '../image/mhaddaou.jpg'
import Image from 'next/image';
import { MyContext } from './Context';
import { useContext } from 'react';
const NewContactList = () =>{
    const context = useContext(MyContext);

    const click = () =>{
        console.log('is click abouve contact')
        context?.setShowMsg('hidden');
    }
    return (
        <div className="h-full w-full  rounded-2xl flex flex-col gap-1">
            <div className="h-[5%] rounded-2xl flex justify-center items-center">
                <p className="font-mono font-bold">Contact List</p>
            </div>
            <div className="h-[95%] w-full  rounded-2xl flex flex-col gap-1 px-2 md:px-1 overflow-y-auto scrollbar-none">
                <button onClick={click} className="py-2 bg-slate-300 w-full h-16 flex px-4 gap-5  rounded-lg">
                    <div className='w-1/2 h-full flex items-center gap-3'>
                    <div className="avatar">
                                        <div className="w-10 rounded-full ring ring-green-400 ring-offset-base-100 ring-offset-2">
                                            <Image src={mhaddaou} alt="av" />
                                        </div>
                                    </div>
                        <div className='font-mono font-semibold'>{context?.name}</div>
                    </div>
                    <div className='w-1/2 h-full flex items-center justify-end'>
                        <div className='w-5 h-5 bg-emerald-600 rounded-full text-xs flex justify-center items-center text-slate-800'>
                            2
                        </div>
                    </div>
                </button>
            
                
            </div>

        </div>
    );

}

export default NewContactList;