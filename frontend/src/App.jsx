import './App.css'
import Sidebar from "./components/sidebar";
import Chatwindow from "./components/chatwindow";
import Auth from "./components/auth";
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
  const [isloading,setisloading]=useState(false);
  

  // isloggedin state
  const [isloggedin,setisloggedin]=useState(false);

  const providervalue = {prompt,setprompt,reply,setreply,currentid,setcurrentid,isloading,setisloading,
  allthreads,setallthreads,isnewchat,setisnewchat,currentchat,setcurrnetchat,isloggedin,setisloggedin};


  //useeffect for allthreads
  useEffect(()=>{
    if (!isloggedin) return;
    axios.get("http://localhost:8000/api/threads",{withCredentials: true})
         .then((response)=>{
            setallthreads(response.data);
         })
  },[isloggedin]);

  useEffect(()=>{
    axios.get("http://localhost:8000/api/logincheck",{withCredentials: true})
         .then((response)=>{
            setisloggedin(true)
         })
         .catch((err)=>{
           setisloggedin(false);
         })
  },[]);
  return (
    <div className="main">
      <Mycontext.Provider value={providervalue}>
        {!isloggedin?(<Auth/>):(
          <>
            <Sidebar />
            <Chatwindow />
          </>
        )
        }
      </Mycontext.Provider>
    </div>
  )
}

export default App;
