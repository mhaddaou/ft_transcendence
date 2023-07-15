import { ChangeEvent, useContext, useEffect, useState } from "react";
import { MyContext } from "./Context";

import axios from "axios";
import {io} from "socket.io-client"
import Upload from "@/components/Upload";

function checkFile(file : File){
  // max size 10mb
  if (file.type.substring(6, file.type.length) === "jpeg" || file.type.substring(6, file.type.length) === "png"){
    if ((file.size / (1024 * 1024)) < 10){
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
    return (
        <div className="w-full max-w-sm">
          <Upload />
        </div>
       

);

}

export default FormAvatar;
