import "../components_css/chatwindow.css";
import Chat from "./chat";
import Mycontext from "../mycontext";
import { useContext } from "react";
import axios from "axios";

function chatwindow(){
    const {prompt,setprompt,reply,setreply,currentid,setcurrentid}=useContext(Mycontext);
    function modelrequest(){
        axios.post("http://localhost:8000/api/chat",
            {
                message:prompt,
                threadid:currentid
            }
        )
        .then((response)=>{
            setreply(response.data);
            setprompt("");
        })
    }
    return (
        <div className="chatwindow">
            <Chat/>
            <div className="input">
                <button className="fileuploadbtn"><i className="fa-solid fa-plus fileupload"></i></button>
                <input onKeyDown={(e)=>{e.key==="Enter" && modelrequest()}} type="text" value={prompt} placeholder="Ask anything" onChange={(e)=>{setprompt(e.target.value)}}/>
                <div className="submit">
                    <button className="vocalbtn"><i className="fa-solid fa-microphone vocal"></i></button>
                    <button className="sendbtn" onClick={modelrequest} ><i className="fa-solid fa-paper-plane send" ></i></button>
                </div>
            </div>
        </div>
    )
}

export default chatwindow;