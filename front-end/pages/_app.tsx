import '@/styles/globals.css'
import { createContext, useState } from 'react'
import type { AppProps } from 'next/app'
import Mycontext from '@/components/Context'


export default function App({ Component, pageProps }: AppProps) {
  return (

      <Mycontext.Provider value={undefined}>
        <Component {...pageProps} />
      </Mycontext.Provider>
      
  
    )
}
