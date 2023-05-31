
import { useRef, useState } from "react";

function containsSpecialChars(str : string) : boolean {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }


function checkInputName(name : string) : void{
    if (!containsSpecialChars(name) && name.length > 7){
        // data ready to send it to the server
        console.log("send data");
    }
    else{
        // data is malicious code
        console.warn(`name is ${name}`);
    }
}


const FormName = () =>{
    const value  = useRef<HTMLInputElement| null>(null);
    const [valueName , setValue ] = useState<string>(''); 
    var name = "mhaddaou";
    const handl = ( event : any) =>{
        if (event.key === "Enter"){
            if (value.current){
                checkInputName(value.current.value);
            }
        }

    }


    const submit = () =>{
        if (value.current){
            checkInputName(value.current.value);
        }

    }



    return (
        <div className='w-full max-w-sm'>
            <div className="flex items-center border-b border-slate-600 py-2">
                <input onKeyDown={handl} ref={value} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder={`${name}`} aria-label="Full name"/>
                    <button onClick={submit} className="flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                        Submit
                    </button>
                    <button className="flex-shrink-0 border-transparent border-4 text-slate-600 hover:text-slate-800 text-sm py-1 px-2 rounded" type="button">
                            Cancel
                    </button>
            </div>
        </div>
    );
}

export default FormName;