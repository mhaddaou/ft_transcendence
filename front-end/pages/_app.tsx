import '@/styles/globals.css'
import { createContext, useState } from 'react'
import type { AppProps } from 'next/app'
import Mycontext, {Context} from './Context'


export default function App({ Component, pageProps }: AppProps) {
  const [name, setName] = useState<string>("mohamed");
  const UpdateName = (newName : string) : void=>{
    setName(newName);
  }

  const contextValue : Context = {
    name,
    UpdateName,
  }

  
  
  return (
  
    <Mycontext.Provider value={contextValue}>
      <Component {...pageProps} />
    </Mycontext.Provider>
      
  
    )
}
