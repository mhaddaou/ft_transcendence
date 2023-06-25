import { ChangeEvent, useContext, useEffect, useState } from "react";
import { MyContext } from "./Context";

import axios from "axios";
import {io} from "socket.io-client"
import Upload from "@/pages/ft_transcendence/Upload";

function checkFile(file : File){
  // max size 10mb
  console.log(file.name);
  console.log((file.size / (1024 * 1024)));
  // console.log(file.type);
  if (file.type.substring(6, file.type.length) === "jpeg" || file.type.substring(6, file.type.length) === "png"){
    if ((file.size / (1024 * 1024)) < 10){
      console.log("waaaaàaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        return 0;
    }
    else{
      // this file is too big
      return 1;
    }

  }
  else{
    //this file is not a jpeg file or PNG file
    return 2;
  }

}

const FormAvatar = () =>{
    const context = useContext(MyContext);


    // useEffect(() =>{
    //   if (context?.socket) {
    //     context?.socket.emit("updateUser",{avatar : context.img });
    //     console.log("jat jat");
    //   }
    // },[context?.img,])
   

   
    return (
        <div className="w-full max-w-sm">
          <Upload />
        </div>
       

);

}

export default FormAvatar;
