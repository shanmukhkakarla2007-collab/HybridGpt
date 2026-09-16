import Mycontext from "../mycontext";
import { useContext, useEffect } from "react";
import "../components_css/chat.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { toast } from "react-toastify";
import { useRef,useState } from "react";
import axios from "axios";

function chat({modelrequest}) {
    const { isnewchat, setisnewchat, currentchat, setcurrnetchat, currentid, setcurrentid,
        editidx, seteditidx, editmsg, seteditmsg,prompt, setprompt
    } = useContext(Mycontext);

    const [textareavalue,settextareavalue]=useState("");

    useEffect(() => {
        if (currentchat.length > 0) {
            const last = currentchat[currentchat.length - 1];
            if (last.role === "user") {
                const chat = document.querySelector(".chatwindow");
                chat.scrollTo({
                    top: chat.scrollHeight,
                    behavior: "smooth"
                });
            }
        }
    }, [currentchat]);

    function editinput(idx, content) {
        seteditidx(idx);
        seteditmsg(content);
        settextareavalue(content);
    }
    function canceledit(){
        seteditidx(null);
        seteditmsg("");
        settextareavalue("");
    }
    function sendedit(){
        axios.put(`https://backend-u54n.onrender.com/api/threads/${currentid}/edit`,{index:editidx},{ withCredentials: true })
            .then((response)=>{
                setcurrnetchat((prev)=>{
                    return prev.filter((chat,idx)=>{
                        if(idx<editidx){
                            return chat;
                        }
                    })
                })
                const editedMessage = editmsg;
                canceledit();
                modelrequest(editedMessage);
            })
            .catch((error)=>{
                toast.error(error.response?.data || "Something went wrong");
            })
    }


    return (
        <div className="chat">
            {isnewchat && <h2 className="chat-heading">Where should we begin?</h2>}
            {
                currentchat.map((chat, idx) => {
                    if(chat.role === "user"){
                        return (
                            idx===editidx
                            ?
                            <textarea key={idx} value={textareavalue} onChange={(e)=>{settextareavalue(e.target.value);seteditmsg(e.target.value);}}autoFocus/>
                            :
                            <div className="userdiv" key={idx}>
                                <span className="userresponse">{chat.content}</span>
                                <div className="editchat"><button onClick={()=>editinput(idx,chat.content)}><i class="fa-solid fa-pen"></i></button></div>
                            </div>
                        );
                    }
                    return (
                        <div className="gptduiv" key={idx} >
                            <ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default chat;