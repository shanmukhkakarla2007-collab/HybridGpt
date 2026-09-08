import { useState, useContext } from "react";
import Mycontext from "../mycontext";
import axios from "axios";
import "../components_css/auth.css";

function Auth() {

    const { setisloggedin } = useContext(Mycontext);

    const [islogin, setislogin] = useState(true);
    const [username, setusername] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    async function handlesubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add("was-validated");
            return;
        }
        form.classList.add("was-validated");

        if (islogin) {
            try {
                const response = await axios.post(
                    "http://localhost:8000/api/login",
                    {
                        username,
                        password
                    },
                    {
                        withCredentials: true
                    }
                );

                console.log("LOGIN RESPONSE:", response.data);

                if (response.data === "login successfull") {
                    setisloggedin(true);
                    setusername("");
                    setpassword("");
                }

            } catch (error) {
                console.log("LOGIN ERROR:", error);
            }

        } else {
            try {
                const response = await axios.post(
                    "http://localhost:8000/api/signup",
                    {
                        username,
                        email,
                        password
                    },
                    {
                        withCredentials: true
                    }
                );

                console.log("SIGNUP RESPONSE:", response.data);

                if (response.data === "signup successfull") {
                    setisloggedin(true);
                    setusername("");
                    setemail("");
                    setpassword("");
                }

            } catch (error) {
                console.log("SIGNUP ERROR:", error);
            }
        }
    }

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1 className="auth-logo">SigmaGPT</h1>

                <p className="auth-title">
                    {islogin ? "Welcome back" : "Create your account"}
                </p>

                <p className="auth-subtitle">
                    {islogin
                        ? "Login to continue chatting with SigmaGPT"
                        : "Sign up to start using SigmaGPT"
                    }
                </p>

                <form onSubmit={handlesubmit} noValidate class="needs-validation">

                    <div className="auth-input">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
                            required
                            minLength="3"
                            maxLength="30"
                        />
                        <div className="invalid-feedback">
                            Username must be at least 3 characters.
                        </div>
                    </div>

                    {!islogin && (
                        <div className="auth-input">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                required
                            />
                            <div className="invalid-feedback">
                                Enter valid email.
                            </div>
                        </div>
                    )}

                    <div className="auth-input">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            required
                            minLength="6"
                        />
                        <div className="invalid-feedback">
                            Password must containd allest six digits.
                        </div>
                    </div>

                    <button className="auth-button" type="submit">
                        {islogin ? "Login" : "Create account"}
                    </button>

                </form>

                <div className="auth-switch">

                    <span>
                        {islogin
                            ? "Don't have an account?"
                            : "Already have an account?"
                        }
                    </span>

                    <button
                        onClick={() => {
                            setislogin(!islogin);
                            setusername("");
                            setemail("");
                            setpassword("");
                        }}
                    >
                        {islogin ? "Sign up" : "Login"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default Auth;