import '@/styles/globals.css'
import { createContext, useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { MyContextProvider } from '@/components/Context'




export default function App({ Component, pageProps }: AppProps) {
	
  useEffect(() => {
    require('preline')
  }, [])
  return (
      <MyContextProvider>
        <Component {...pageProps} />
      </MyContextProvider>

      
  
    )
}

