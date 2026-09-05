import Mycontext from "../mycontext";
import { useContext } from "react";
import "../components_css/chat.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function chat(){
    const {isnewchat,setisnewchat,currentchat,setcurrnetchat,currentid,setcurrentid} = useContext(Mycontext);
    return (
        <div className="chat">
            {isnewchat && <h2 className="chat-heading">Where should we begin?</h2>}
            {
                currentchat.map((chat,idx)=>{
                    return(
                        <div className={chat.role=="user"?"userdiv":"gptduiv"} key={idx}>
                            {chat.role=="user"?<span className="userresponse">{chat.content}</span>:<ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>}
                        </div>
                    );
                })
            }
        </div>
    );
}

export default chat;