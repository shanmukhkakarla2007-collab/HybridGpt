import './App.css'
import Sidebar from "./components/sidebar";
import Chatwindow from "./components/chatwindow";
import Auth from "./components/auth";
import Mycontext from "./mycontext";
import { useState, useEffect } from 'react';
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function App() {

  const [prompt, setprompt] = useState("");
  const [reply, setreply] = useState("");
  const [currentid, setcurrentid] = useState(crypto.randomUUID());
  const [allthreads, setallthreads] = useState([]);
  const [isnewchat, setisnewchat] = useState(true);
  const [currentchat, setcurrnetchat] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [isloggedin, setisloggedin] = useState(false);
  const [user,setuser]=useState({});

  const providervalue = {
    prompt, setprompt, reply, setreply, currentid, setcurrentid, isloading, setisloading,user,setuser,
    allthreads, setallthreads, isnewchat, setisnewchat, currentchat, setcurrnetchat, isloggedin, setisloggedin
  };

  useEffect(() => {
    if (!isloggedin) return;
    axios.get("https://backend-u54n.onrender.com/api/threads", { withCredentials: true })
      .then((response) => {
        setallthreads(response.data.allthreads);
        setuser(response.data.user);
      })
      .catch((err) => {
        toast.error(err.response?.data || "Something went wrong");
      })
  }, [isloggedin]);

  useEffect(() => {
    axios.get("https://backend-u54n.onrender.com/api/logincheck", { withCredentials: true })
      .then((response) => {
        setisloggedin(true);
        setuser(response.data.user);
      })
      .catch((err) => {
        setisloggedin(false);
      })
  }, []);

  return (
    <div className="main">
      <Mycontext.Provider value={providervalue}>
        {!isloggedin ? (<Auth />) : (
          <>
            <Sidebar />
            <Chatwindow />
          </>
        )
        }
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
          toastClassName="custom-toast"
        />
      </Mycontext.Provider>
    </div>
  )
}

export default App;
