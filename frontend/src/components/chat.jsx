import Mycontext from "../mycontext";
import { useContext, useEffect } from "react";
import "../components_css/chat.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { toast } from "react-toastify";

function chat() {
    const { isnewchat, setisnewchat, currentchat, setcurrnetchat, currentid, setcurrentid } = useContext(Mycontext);

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

    return (
        <div className="chat">
            {isnewchat && <h2 className="chat-heading">Where should we begin?</h2>}
            {
                currentchat.map((chat, idx) => {
                    return (
                        <div className={chat.role == "user" ? "userdiv" : "gptduiv"} key={idx}>
                            {chat.role == "user" ? <span className="userresponse">{chat.content}</span> : <ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>}
                            {chat.role == "user" && <div className="editchat"><i class="fa-solid fa-pen"></i></div>}
                        </div>
                    );
                })
            }
        </div>
    );
}

export default chat;