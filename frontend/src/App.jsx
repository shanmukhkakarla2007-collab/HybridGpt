import './App.css'
import Sidebar from "./components/sidebar";
import Chatwindow from "./components/chatwindow";
import Mycontext from "./mycontext";
import { useState ,useEffect} from 'react';
import axios from "axios";


function App(){

  const [prompt,setprompt]=useState("");
  const [reply,setreply]=useState("");
  const [currentid,setcurrentid]=useState(crypto.randomUUID());
  //alltreads state
  const [allthreads,setallthreads]=useState([]);
  //isnewchat state
  const [isnewchat,setisnewchat]=useState(true);
  //currentchat state
  const [currentchat,setcurrnetchat]=useState([]);

  const providervalue = {prompt,setprompt,reply,setreply,currentid,setcurrentid,
  allthreads,setallthreads,isnewchat,setisnewchat,currentchat,setcurrnetchat};


  //useeffect for allthreads
  useEffect(()=>{
    axios.get("http://localhost:8000/api/threads")
         .then((response)=>{
            setallthreads(response.data);
         })
  },[]);

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
