
import { useContext, useRef, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { MyContext } from "./Context";
import { Socket } from "socket.io-client";
import InfoContact from "./InfoContact";
import { SubmitName } from "./InfoContact";


function containsSpecialChars(str : string) : boolean {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }





  const FormName = () => {
    const context = useContext(MyContext);
    var Msg : string = '';
    const [num, setNum] = useState(false);
    
    function checkInputName(name: string): void {
      if (!containsSpecialChars(name) && name.length > 7) {
        if (context?.socket) {
          context?.socket.emit("updateUser",{username : name});
          context.socket.on('message', (msg: string) => {
            console.log(msg);
          })
          context.socket.on("errorMessage", (msg: string) => {
            console.log(msg);
          })
        }
          
        Msg = "send data";
        context?.setName(name);
      } else {
        // data is malicious code
        Msg = "the name is small or not valid";
        console.warn(`name is ${name}`);
      }
    }
    
    const value = useRef<HTMLInputElement | null>(null);
    const [valueName, setValue] = useState<string>(''); // Initialize with an empty string
    var name = context?.name;
    
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
      cancel();
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
        <form className="flex items-center border-b border-slate-600 py-2">
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
          <SubmitName />
          {/* <InfoContact /> */}
          {/* <button
            onClick={submit}
            className="flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
          >
            Submit
          </button> */}
          <button
            onClick={cancel}
            className="flex-shrink-0 border-transparent border-4 text-slate-600 hover:text-slate-800 text-sm py-1 px-2 rounded"
            type="button"
          >
            Cancel
          </button>
        </form>
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