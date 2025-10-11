'use client'
 
import dynamic from 'next/dynamic'
 
//const App = dynamic(() => import('../../App'), { ssr: false })
 
export function ClientOnly() {
  //console.log("Client component mounted")
  //return <App />
  return false;
}