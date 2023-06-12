import axios from "axios";
import Modal from "@/components/Modal";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import Image, { StaticImageData } from "next/image";
import { url } from "inspector";
import { MyContext } from "@/components/Context";
const Upload = () =>{


    const context = useContext(MyContext);
    let imgSrc: string | Blob | MediaSource | StaticImageData;
    const [url, setUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState(''); // for title modal
    const [msg, setMsg] = useState(''); // for msg modal
    const [color, setColor] = useState(''); // for color modal



    function sendToBck(Url : string) {
        if (context?.socket) {
            context?.socket.emit("updateUser",{avatar : Url });
        }
    }
    const uploadImage = () =>{


            const form = new FormData();
    
            
            if (file){
                
                
                
                form.append("file", file);
                form.append("upload_preset", "mhaddaou");
                // this file is not jpeg or PNG
                if ((file.type !== "image/jpeg") && (file.type !== "image/png")){
                    setColor('bg-orange-600');
                    setMsg('this image is not jpeg or PNG');
                    setTitle('Warning!');
                    setIsModalOpen(true);
                }
                else if ((file.size / (1024 * 1024)) > 10){
                    console.log("this file is too big");
                    setColor('bg-orange-600');
                    setMsg('this image is more than 6MB');
                    setTitle('Warning!');
                    setIsModalOpen(true);
                }
                else{  
                    axios.post("https://api.cloudinary.com/v1_1/daczu80rh/upload", form)
                    .then((result) =>{
                        setUrl(result.data.secure_url);
                        context?.setImg(result.data.secure_url);
                        sendToBck(result.data.secure_url);
                        setColor('bg-green-500');
                        setMsg('The image was successfully uploaded');
                        setTitle('Success!');
                        setIsModalOpen(true);
                    })
                }
                setFile(null);
                
            }
            //if the client click in upload without selec(image);
            else{
                setColor('bg-orange-600');
                setMsg('the image is empty');
                setTitle('Warning!');
                setIsModalOpen(true);
                
                
            }
            // }
        }
        const handleChange = (e : ChangeEvent<HTMLInputElement>) =>{
            if (e.target.files )
            setFile(e.target.files[0]);
            
            
        }

    const openModal = () => {
      setIsModalOpen(true);
    };


    const closeModal = () => {
      setIsModalOpen(false);
    };
       
    return (
        <div className="flex items-center border-b border-slate-600 py-2">
            {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModal} title={title} msg={msg} color={color}/>}
                    <label className=" cursor-pointer flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded" >
                        <input onChange={handleChange} type="file" className="hidden" />
                        select file
                    </label>
                    <button onClick={() =>{
                      uploadImage();
                    }} className=" ml-2 flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                            Upload
                    </button>
            </div>

    )
}
export default Upload;