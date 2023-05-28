import { useContext, createContext } from "react";


//define shape

export interface Context{
    name : string,
    UpdateName : (newName : string) => void,
}
//create context with last export
const Mycontext = createContext<Context | undefined>(undefined);

//create custom context
export const useMyContext = (): Context =>{
    const context = useContext(Mycontext);
    if (!context){
        throw new Error("Context Error");
    }
    return context;
}


export default Mycontext;