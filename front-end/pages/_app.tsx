import '@/styles/globals.css'
import { createContext, useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { MyContextProvider } from '@/components/Context';



export default function App({ Component, pageProps }: AppProps) {
	
  useEffect(() => {
    import('preline')
  }, [])
  return (

      <MyContextProvider>
        <Component {...pageProps} />
      </MyContextProvider>
      
  
    )
}


mport '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { MyContextProvider } from '../components/Context';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <MyContextProvider >
      <Component {...pageProps} />
    </MyContextProvider>




  );
}

[{
	"resource": "/goinfre/mhaddaou/ft_transcendence/front-end/pages/_app.tsx",
	"owner": "typescript",
	"code": "7016",
	"severity": 8,
	"message": "Could not find a declaration file for module 'preline'. '/goinfre/mhaddaou/ft_transcendence/front-end/node_modules/preline/dist/preline.js' implicitly has an 'any' type.\n  Try `npm i --save-dev @types/preline` if it exists or add a new declaration (.d.ts) file containing `declare module 'preline';`",
	"source": "ts",
	"startLineNumber": 10,
	"startColumn": 12,
	"endLineNumber": 10,
	"endColumn": 21
}]
