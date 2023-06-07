import Link from 'next/link';
import mhaddaou from '../image/mhaddaou.jpg'
import Image from 'next/image';

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

export default InfoContact;