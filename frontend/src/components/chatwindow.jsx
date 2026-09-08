import "../components_css/chatwindow.css";
import Chat from "./chat";
import Mycontext from "../mycontext";
import { useContext } from "react";
import axios from "axios";
import { RingLoader } from 'react-spinners';

function chatwindow() {
    const { prompt, setprompt, reply, setreply, currentid, setcurrentid, isnewchat,
        setisnewchat, currentchat, setcurrnetchat, allthreads, setallthreads, isloading, setisloading } = useContext(Mycontext);
    function modelrequest() {
        if (isnewchat) {
            setisnewchat(false);
        }
        setcurrnetchat((prev) => {
            return [...prev, {
                role: "user",
                content: prompt
            }]
        })
        setisloading(true);
        axios.post("http://localhost:8000/api/chat",
            {
                message: prompt,
                threadid: currentid
            },
            {
                withCredentials: true
            }
        )
            .then((response) => {
                setreply(response.data.gptmodelresponse);
                setprompt("");
                setisloading(false);
                if (isnewchat) {
                    setallthreads((prev) => {
                        return [...prev, response.data.findthread]
                    })
                    // setisnewchat(false);
                }
                setcurrnetchat((prev) => {
                    return [...prev, {
                        role: "assistant",
                        content: response.data.gptmodelresponse
                    }]
                })
            })
    }
    return (
        <div className="chatwindow">
            <Chat />
            {isloading && <div className="loader-div">
                <RingLoader color="white" className="loader" />
            </div>}
            <div className="input" style={isnewchat ? { bottom: "20rem" } : { bottom: "1.5rem" }}>
                <button className="fileuploadbtn"><i className="fa-solid fa-plus fileupload"></i></button>
                <input onKeyDown={(e) => { e.key === "Enter" && modelrequest() }} type="text" value={prompt} placeholder="Ask anything" onChange={(e) => { setprompt(e.target.value) }} />
                <div className="submit">
                    <button className="vocalbtn"><i className="fa-solid fa-microphone vocal"></i></button>
                    <button className="sendbtn" onClick={modelrequest} ><i className="fa-solid fa-paper-plane send" ></i></button>
                </div>
            </div>
        </div>
    )
}

export default chatwindow;