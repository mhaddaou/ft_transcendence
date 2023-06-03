import React, {useContext, createContext} from "react";


interface DataContext{
    name : string,
    updateName : (newName : string) => void,
}


const Mycontext = createContext<DataContext | undefined>(undefined);

export const UseContext = () : DataContext =>{
    const context = useContext(Mycontext);

    if (!context)
        throw new Error ("the context doesn't create")
    else
        return context;
}

export default Mycontext;