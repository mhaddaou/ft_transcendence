import '@/styles/globals.css'
import { createContext, useContext, useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { MyContext, MyContextProvider } from '@/components/Context'
import createSocketConnection from '@/components/socketConnection';





export default function App({ Component, pageProps }: AppProps) {
  const context = useContext(MyContext);
	
 
  useEffect(() => {
    require('preline')
  }, [])

  

  return (
      <MyContextProvider>
        <Component {...pageProps} />
      </MyContextProvider>

      
  
    )
}

