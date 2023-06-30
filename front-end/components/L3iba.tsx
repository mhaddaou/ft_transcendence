import { useContext, useState, useEffect } from "react";
import { useMyContext } from "./Context";



const L3iba = () =>{
    const { name, UpdateName } = useMyContext();
    const [newName, setName] = 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      UpdateName(e.target.value);
    };
  
    return (
      <div>
        <p>Current name: {name}</p>
        <input type="text" value={name} placeholder="input" onChange={handleChange} />
      </div>
    );
}

export default L3iba;