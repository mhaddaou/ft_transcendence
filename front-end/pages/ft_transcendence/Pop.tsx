import React from "react";
import Image from "next/image";
import Logo from '../../image/42_logo.svg'
import Login from "./Login";
import Datausers from '../../components/users.json'
import axios from "axios";
import Router from "next/router";
export default function Modal( ) {
  const router = Router;
  const [showModal, setShowModal] = React.useState(false);
  const click = () =>{
    router.push('http://localhost:5000/auth/42');
    
  }
  
  return ( 
    <>
        <button onClick={click}  className='z-30 py-2 px-6 bg-slate-600 rounded-full self-center md:self-start border-4 border-cyan-300 font-semibold 
                                hover:border-cyan-800 hover:bg-slate-900 hover:text-white'>Sing in with 
                <Image className=' w-6 md:w-7 inline-block ml-2' src={Logo} alt='logo' />
        </button>
        <>
        {
            showModal &&  <div 
            className="  justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-center p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold ">
                    Login
                  </h3>
                  
                </div>
                <div className="relative p-6 flex-auto">
                  <Login />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {/* <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        }
        {
            showModal &&

            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        }
        </>
   
  </>
   );
}