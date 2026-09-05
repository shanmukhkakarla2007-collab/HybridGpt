import { useContext } from "react";
import "../components_css/sidebar.css";
import Mycontext from "../mycontext";
import axios from "axios";

function sidebar() {

    const { allthreads, setallthreads, isnewchat
        , setisnewchat, currentchat, setcurrnetchat, currentid, setcurrentid } = useContext(Mycontext);
    //add on click functiuonality for newchat
    function newchat() {
        setcurrentid(crypto.randomUUID());
        setisnewchat(true);
        setcurrnetchat([]);
    }
    //add on click functionality for listitem
    function oldchat(threadid) {
        setcurrentid(threadid);
        setisnewchat(false);
        axios.get(`http://localhost:8000/api/threads/${threadid}`)
            .then((response) => {
                setcurrnetchat(response.data);
            })
    }
    function unpin(threadid) {
        axios.put(`http://localhost:8000/api/threads/${threadid}/unpin`)
            .then((response) => {
                setallthreads((prev) =>
                    prev.map((thread) =>
                        thread.threadid === threadid
                            ? response.data
                            : thread
                    )
                );
            })
    }
    function pin(threadid) {
        axios.put(`http://localhost:8000/api/threads/${threadid}/pin`)
            .then((response) => {
                setallthreads((prev) =>
                    prev.map((thread) =>
                        thread.threadid === threadid
                            ? response.data
                            : thread
                    )
                );
            })
    }
    function deletethread(threadid) {
        axios.delete(`http://localhost:8000/api/threads/${threadid}`)
            .then((response) => {
                setallthreads((prev) => {
                    return prev.filter((thread) => {
                        return thread.threadid != response.data.threadid
                    })
                })
                if (currentid == threadid) {
                    newchat();
                }
            })
    }
    return (
        <div className="sidebar">
            <div className="sidebar-nav">
                <div className="nav-logos">
                    <button onClick={newchat}><h5 className="name">ChatGPT</h5></button>
                    <button className="search "><i class="fa-brands fa-sistrix"></i></button>
                </div>
                <button className="btn new-chat " onClick={newchat}><i className="fa-regular fa-pen-to-square" ></i><span className="mx-2">New chat</span></button>
            </div>
            <div className="siderbar-body">
                <h5>Pinned <button><i class="fa-solid fa-chevron-right"></i></button></h5>
                <ul>
                    {allthreads
                        .filter((thread) => thread.ispinned)
                        .map((thread) => {
                            if (thread.ispinned) {
                                return <li key={thread.threadid} onClick={() => { oldchat(thread.threadid) }}>
                                    <div>
                                        <i class="fa-regular fa-comment"></i>
                                        <span>{thread.title}</span>
                                    </div>
                                    <div>
                                        <button onClick={(e) => { e.stopPropagation(); unpin(thread.threadid); }}><i class="fa-solid fa-thumbtack-slash"></i></button>
                                        <button onClick={(e) => { e.stopPropagation(); deletethread(thread.threadid) }}><i class="fa-regular fa-trash-can"></i></button>
                                    </div>
                                </li>
                            }
                        })}
                </ul>
                <h5>Recent <button><i class="fa-solid fa-chevron-right"></i></button></h5>
                <ul>
                    {allthreads
                        .filter((thread) => !thread.ispinned)
                        .map((thread) => {
                            if (!thread.ispinned) {
                                return <li key={thread.threadid} onClick={() => { oldchat(thread.threadid) }}>
                                    <div>
                                        <i class="fa-regular fa-comment"></i>
                                        <span>{thread.title}</span>
                                    </div>
                                    <div>
                                        <button onClick={(e) => { e.stopPropagation(); pin(thread.threadid); }}><i class="fa-solid fa-thumbtack"></i></button>
                                        <button onClick={(e) => { e.stopPropagation(); deletethread(thread.threadid) }}><i class="fa-regular fa-trash-can"></i></button>
                                    </div>
                                </li>
                            }
                        })}
                </ul>
            </div>
            <div className="sidebar-fotter">

            </div>
        </div>
    )
}


export default sidebar;

