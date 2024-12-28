import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {

  const [messages,setMessages] = useState<string[]>(["hi there","hello"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket>();

  useEffect(()=>{
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;
    ws.onopen = ()=> {
      ws.send(JSON.stringify({
        type:"join",
        payload:{
         roomId:"1234"
        }
      }))
    }
    ws.onmessage = (e)=>{
      setMessages(m => [...m,e.data.toString()]);
    }

    return () => {
      ws.close()
    }
  },[])

  const sendMessage = () => {
    if(inputRef.current){
      const msg = inputRef.current.value;
      wsRef.current?.send(JSON.stringify({
        type:"chat",
        payload:{
          message:msg
        }
      }))
      inputRef.current.value = '';
    }
  }

  return (
    <>
      <div className="flex flex-col justify-between h-screen w-full">
        <div className=' flex flex-col-reverse justify-start items-end p-10 h-[70vh] bg-red-400 w-full'>
          {messages.map(msg=>{
            return <div className='flex justify-end py-2 px-4 bg-red-300 border border-red-500 mt-2 rounded-md'>{msg}</div>
          })}
        </div>
        <div className='flex justify-center items-center w-full h-[30vh] bg-gray-200'>
          <input ref={inputRef} type="text" name="" id="" className='w-80 px-4 py-2 rounded-md text-black' placeholder='Enter message...'/>
          <button className='ml-5 px-4 py-2 bg-black text-white rounded-md' onClick={sendMessage}>Send Message</button>
        </div>
      </div>
    </>
  )
}

export default App
