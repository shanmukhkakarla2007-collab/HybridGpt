import Mycontext from "../mycontext";
import { useContext } from "react";
function chat(){
    const {isnewchat,setisnewchat,currentchat,setcurrnetchat,currentid,setcurrentid} = useContext(Mycontext);
    return (
        <div className="chat">
            {isnewchat && <h2>What’s on your mind today?</h2>}
        </div>
    )
}
export default chat;