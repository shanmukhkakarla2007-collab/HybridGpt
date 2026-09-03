import './App.css'
import Sidebar from "./components/sidebar";
import Chatwindow from "./components/chatwindow";
import Mycontext from "./mycontext";
import { useState } from 'react';


function App(){

  const [prompt,setprompt]=useState("");
  const [reply,setreply]=useState("");
  const [currentid,setcurrentid]=useState(crypto.randomUUID());
  const providervalue = {prompt,setprompt,reply,setreply,currentid,setcurrentid};
  //alltreads state
  //isnewchat state
  //currentchat state


  //useeffect for allthreads
  
  return (
    <div className="main">
      <Mycontext.Provider value={providervalue}>
        <Sidebar />
        <Chatwindow />
      </Mycontext.Provider>
    </div>
  )
}

export default App;
