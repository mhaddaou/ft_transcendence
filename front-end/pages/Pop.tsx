import { WindSong } from "next/font/google";

const Pop = () =>{

    return (
        <div className="min-h-screen bg-slate-400 flex justify-center items-center">
            
{/* <button className="btn" onClick="my_modal_1.showModal()">open modal</button> */}
<dialog id="my_modal_1" className="modal modal-open">
  <form method="dialog" className="modal-box">
    <h3 className="font-bold text-lg">Hello!</h3>
    <p className="py-4">Press ESC key or click the button below to close</p>
    <div className="modal-action">
      <button className="btn">Close</button>
    </div>
  </form>
</dialog>
        </div>
    );
}

export default Pop;