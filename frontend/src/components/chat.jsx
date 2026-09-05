import Mycontext from "../mycontext";
import { useContext } from "react";
import "../components_css/chat.css";

function chat(){
    const {isnewchat,setisnewchat,currentchat,setcurrnetchat,currentid,setcurrentid} = useContext(Mycontext);
    return (
        <div className="chat">
            {isnewchat && <h2 className="chat-heading">Where should we begin?</h2>}
            {
                currentchat.map((chat,idx)=>{
                    return(
                        <div className={chat.role=="user"?"userdiv":"gptduiv"} key={idx}>
                            {chat.role=="user"?<span className="userresponse">{chat.content}</span>:<p className="gptresponse">{chat.content}</p>}
                        </div>
                    );
                })
            }
        </div>
    );
}

export default chat;