
import { useContext, useEffect, useRef, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { MyContext } from "./Context";
import { Socket } from "socket.io-client";
import InfoContact from "./InfoContact";
import { SubmitName } from "./InfoContact";
import { Hidden } from "@mui/material";
import Modal from "./Modal";
import { checkIs7rag } from "./Functions";


function containsSpecialChars(str : string) : boolean {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }





  const FormName = () => {
    const context = useContext(MyContext);
    const [msg, setMsg] = useState('') // msg for modal
    const [num, setNum] = useState(false);
    const [valueName, setValue] = useState<string>(''); // Initialize with an empty string
    const [color, setColor] = useState(''); // color for modal
    var name = context?.name;
    const [title, setTitle] = useState(''); // title for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
      setIsModalOpen(true);
    };
    const closeModal = () => {
      setIsModalOpen(false);
    };

    useEffect(() =>{
      context?.socket?.on('updateUsername', (pay : any) =>{
        if (pay){
            setMsg("the name is changed");
            setColor("bg-green-400");
            setTitle("Success");
            context.setName(pay.username);
            setValue('');
            openModal();
          
        }
      })
      context?.socket?.on('errorMessageUpdateUsername', (pay : any) =>{
        if (pay){
          console.log('hada ', pay);
            setMsg(pay.message);
            setColor("bg-orange-400");
            setTitle("Failed")
            setValue('');
            openModal();
            console.log('fin')

        }
      })

      return () =>{
        context?.socket?.off('updateUsername');
        context?.socket?.off('errorMessageUpdateUsername');
      }
      
    }, [context?.socket])
    
    function checkInputName(name: string): void {
      // setNum(true);
      if (!containsSpecialChars(name) && name.length > 7) {
        if (context?.socket) {
          console.log('dkhelt ....');
          // here when i check is 7rag
          context.token
          checkIs7rag(context?.token)
          context?.socket.emit("updateUsername",{username : name});
        }
      } else {
        // data is malicious code
        setMsg("the name is small or not valid");
        setColor("bg-orange-400");
        setTitle("Failed");
        openModal();
      }
    }
    
    const value = useRef<HTMLInputElement | null>(null);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value); // Update the valueName state as you type
    };
    
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        if (value.current) {
          checkInputName(value.current.value);
        }
      }
    };
    
    const submit = () => {
      if (value.current) {
        checkInputName(value.current.value);
      }
    };
    
    const cancel = () => {
      setValue('');
      if (value.current) {
        value.current.value = '';
      }
    };
        

    
    return (
      <div className='w-full max-w-sm'>
        {/* <InfoContact /> */}
        <div className="flex items-center border-b border-slate-600 py-2">
          <input
            value={valueName}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            ref={value}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder={`${name}`}
            aria-label="Full name"
          />

          {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModal} title={title} msg={msg} color={color}/>}
          {/* <SubmitName /> */}
           <button
            onClick={() =>{
              submit();              
            }}
            className="flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
          >
            Submit
          </button>
          <button
            onClick={cancel}
            className="flex-shrink-0 border-transparent border-4 text-slate-600 hover:text-slate-800 text-sm py-1 px-2 rounded"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };
  
  export default FormName;
  


export function InputMsg() {
    return (
            <div className="flex items-center border-b border-slate-600 py-2 w-full  bg-red-300 px-6">

                <input  className="appearance-none bg-transparent border-none text-gray-700 mr-3 py-1 px-6 leading-tight focus:outline-none" 
                type="text" placeholder={``} aria-label="Full name"/>
            </div>
    );
}

export function InputMsg2() {
    return (
        <div className="h-[4%] w-full   rounded-b-xl flex justify-center items-end">
            <div className="w-full flex h-full rounded">
                <div className="w-full h-full flex flex-row items-center  rounded-lg">
                        <input className=" bg-red-400 appearance-none w-[90%] font-extraligh font-mono bg-transparent border-none   text-slate-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Type a message" aria-label="Full name"/> 
                        <button className=" flex-shrink-0  h-full w-[10%] text-sm   py-1 px-2 rounded" type="button">
                        <RiSendPlaneFill className="h-8 w-6 text-white  " />
                        </button>
                </div>
                        
            </div>
        </div>
    );
}