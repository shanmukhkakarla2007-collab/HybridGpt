import React, { useState, useContext } from "react";
import axios from "axios";
import "../components_css/profile.css";
import { toast } from "react-toastify";
import Mycontext from "../mycontext";

function Profile() {
    
    const {isloggedin, setisloggedin,user,setuser}=useContext(Mycontext);
    const [showMenu, setShowMenu] = useState(false);

    async function handleLogout() {

        await axios.get(
            "http://localhost:8000/api/logout",
            { withCredentials: true }
        )
        .then((response) => {
            setisloggedin(false);
        })
        .catch((error)=>{
            toast.error(error.response?.data || "Something went wrong");
        })
    }

    return (
        <div className="profile-container">
            <div
                className="profile-button"
                onClick={() => setShowMenu(!showMenu)}
            >
                <div className="profile-avatar">
                    {user.username.substring(0, 2).toUpperCase()}
                </div>

                <div className="profile-name">
                    {user.username}
                </div>
            </div>

            {showMenu && (
                <div className="profile-popup">

                    <div
                        className="logout"
                        onClick={handleLogout}
                    >
                        Log out
                    </div>

                </div>
            )}

        </div>
    );
}

export default Profile;