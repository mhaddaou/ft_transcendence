import { ChangeEvent, useContext } from "react";
import { MyContext } from "./Context";

const FormAvatar = () =>{
    const context = useContext(MyContext);
    const handlefile= (event : ChangeEvent<HTMLInputElement>) =>{
        if (event.target.files && event.target.files.length > 0){
            context?.setImg(event.target.files[0]);
            context?.setCheck(1);
        }
    }
    return (
        <form className="w-full max-w-sm">
            <div className="flex items-center border-b border-slate-600 py-2">
                    <label className=" cursor-pointer flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded" >
                        <input onChange={handlefile} type="file" className="hidden" />
                        select file
                    </label>
                    <button className=" ml-2 flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                            Upload
                    </button>
            </div>
        </form>
       

);

}

export default FormAvatar;
