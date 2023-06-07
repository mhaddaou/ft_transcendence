import mhaddaou from '../image/mhaddaou.jpg'
import Image from 'next/image';

const InfoContact = () =>{
    return (
        <div >

<label htmlFor="my_modal_6" className="btn flex text-center bg-transparent border-transparent">Info</label>
<input type="checkbox" id="my_modal_6" className="modal-toggle" />
<div className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg text-center">Mhaddaou</h3>
        <Image className='rounded-3xl' src={mhaddaou} alt='avatar' />
    <p className="py-4 text-left ">info here </p>
    <div className="modal-action">
      <label htmlFor="my_modal_6" className="btn bg-slate-400 border-slate-500">Close!</label>
    </div>
  </div>
</div>
</div>
    );
}

export default InfoContact;