import "../components_css/chatwindow.css";
import Chat from "./chat";
import Mycontext from "../mycontext";
import { useContext, useRef } from "react";
import axios from "axios";
import { RingLoader } from 'react-spinners';
import { toast } from "react-toastify";

function chatwindow() {

    const { prompt, setprompt, reply, setreply, currentid, setcurrentid, isnewchat, isrecording, setisrecording,
        setisnewchat, currentchat, setcurrnetchat, allthreads, setallthreads, isloading, setisloading } = useContext(Mycontext);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    function modelrequest(prompt) {
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
        axios.post("https://backend-u54n.onrender.com/api/chat",
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
                }
                setcurrnetchat((prev) => {
                    return [...prev, {
                        role: "assistant",
                        content: response.data.gptmodelresponse
                    }]
                })
            })
            .catch((err) => {
                setisloading(false);
                toast.error(err.response?.data || "Something went wrong");
            })
    }

    async function startrecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable =
                (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(
                            event.data
                        );
                    }
                };

            mediaRecorder.onstop =
                async () => {
                    const audioBlob =
                        new Blob(
                            audioChunksRef.current,
                            {
                                type: "audio/webm"
                            }
                        );
                    stream
                        .getTracks()
                        .forEach(
                            track => track.stop()
                        );
                    await transcribeAudio(audioBlob);
                };
            mediaRecorder.start();
            setisrecording(true);
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    }

    function stoprecording() {
        if (mediaRecorderRef.current) {

            mediaRecorderRef.current.stop();

            setisrecording(false);
        }
    }

    function transcribeAudio(audioBlob) {
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.webm");
        axios.post("https://backend-u54n.onrender.com/api/transcribe", formData, { withCredentials: true })
            .then((response) => {
                setprompt(response.data.text);
            })
            .catch((err) => {
                toast.error(err.response?.data || "Something went wrong");
            })
    }

    return (
        <div className="chatwindow">
            <Chat modelrequest={modelrequest}/>
            {isloading && <div className="loader-div">
                <RingLoader color="white" className="loader" />
            </div>}
            <div className="input" style={isnewchat ? { bottom: "20rem" } : { bottom: "1.5rem" }}>
                <button className="fileuploadbtn"><i className="fa-solid fa-plus fileupload"></i></button>
                <input onKeyDown={(e) => {
                    if (e.key === "Enter" && !isrecording) {
                        modelrequest(prompt);
                    }
                }} type="text" value={prompt} placeholder="Ask anything" onChange={(e) => { setprompt(e.target.value) }} />
                <div className="submit">
                    <button className="vocalbtn" onClick={
                        () => {
                            if (!isrecording) {
                                startrecording();
                            }
                            else {
                                stoprecording();
                            }
                        }
                    }> {!isrecording ? <i className="fa-solid fa-microphone vocal"></i> : <i class="fa-solid fa-record-vinyl"></i>}</button>
                    <button className="sendbtn" onClick={()=>modelrequest(prompt)} ><i className="fa-solid fa-paper-plane send" ></i></button>
                </div>
            </div>
        </div>
    )
}

export default chatwindow;