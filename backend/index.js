if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const port = 8000;
const mongoose = require('mongoose');
const threads = require("./models/threads.js");
const users = require("./models/users.js");
const gptmodel = require('./utils/gptmodel.js');
const cors = require("cors");
const { token } = require("./token.js");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const {logincheck,signupvalidation,loginvalidation,chatvalidation}=require("./middlewares.js");

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


async function connect() {
    await mongoose.connect(process.env.MONGODB_URL);
}
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
    connect()
        .then(() => {
            console.log("Databse is connect succesfully")
        })
        .catch((err) => {
            console.log("Database connection is unsuccessfull", err);
        })
})



app.get("/api/testdb", async (req, res) => {
    const thread = new threads({
        threadid: 12,
        title: "test thread",
        messages: [
            {
                role: "user",
                content: "what is 3+1?"
            },
            {
                role: "assistant",
                content: "its 4"
            }
        ]
    });
    const response = await thread.save();
    res.json(response);
})
app.get("/api/threads",logincheck,async (req, res) => {
    const allthreads = await threads.find({user:req.user.id}).sort({ updatedat: -1 });
    res.json(allthreads);
})
app.get("/api/threads/:threadid",logincheck,async (req, res) => {
    const { threadid } = req.params;
    const thread = await threads.findOne({ threadid,user:req.user.id});
    res.json(thread.messages);
})
app.delete("/api/threads/:threadid",logincheck,async (req, res) => {
    const { threadid } = req.params;
    const deletedthread = await threads.findOneAndDelete({ threadid: threadid,user:req.user.id});
    res.json(deletedthread);
})
app.post("/api/chat",logincheck,chatvalidation,async (req, res) => {
    console.log("request reached");
    const { message, threadid } = req.body;
    let findthread = await threads.findOne({ threadid: threadid,user:req.user.id});
    if (!findthread) {
        const thread = new threads({
            threadid: threadid,
            title: message,
            messages: [
                {
                    role: "user",
                    content: message
                }
            ],
            user:req.user.id
        });
        findthread = thread;
    }
    else {
        findthread.messages.push(
            {
                role: "user",
                content: message
            },
        );
    }
    const gptmodelresponse = await gptmodel(findthread.messages);
    findthread.messages.push(
        {
            role: "assistant",
            content: gptmodelresponse
        }
    );
    findthread.updatedat = Date.now();
    await findthread.save();
    res.json({ gptmodelresponse, findthread });
})
app.put("/api/threads/:threadid/unpin",logincheck,async (req, res) => {
    console.log("pin route is hitted");
    const { threadid } = req.params;
    const updatedhread = await threads.findOneAndUpdate({ threadid: threadid,user:req.user.id}, { ispinned: false }, { new: true });
    res.json(updatedhread);
})
app.put("/api/threads/:threadid/pin",logincheck,async (req, res) => {
    console.log("pin route is hitted");
    const { threadid } = req.params;
    const updatedhread = await threads.findOneAndUpdate({ threadid: threadid,user:req.user.id}, { ispinned: true }, { new: true });
    res.json(updatedhread);
})
app.post("/api/signup",signupvalidation,async (req, res) => {
    try {
        console.log(" SIGNUP ROUTE HIT");
        console.log("BODY:", req.body);
        const { username, email, password } = req.body;
        const finduser = await users.findOne({ $or: [{ username: username }, { email: email }] });
        if (finduser) {
            console.log("user already exists");
            return res.json("user already exists");
        }
        console.log("err1");
        const hashedpassword = await bcrypt.hash(
            password,
            10
        );
        console.log("err2");
        const newuser = new users({
            username: username,
            email: email,
            password: hashedpassword
        });
        console.log("err3");
        await newuser.save();
        console.log("err4");
        res.cookie("token", token(newuser._id, newuser.username));
        res.json("signup successfull");
    }
    catch(error){
        console.log(error);
        res.json(error);
    }

});
app.post("/api/login",loginvalidation,async (req, res) => {
    const { username, password } = req.body;
    const finduser = await users.findOne({ username: username });
    if (!finduser) {
        return res.json("you should signup first");
    }
    const comparepassword = await bcrypt.compare(password, finduser.password);
    if (!comparepassword) {
        return res.json("invalid username or password");
    }
    res.cookie("token", token(finduser._id, finduser.username));
    res.json("login successfull");
})
app.get('/api/logout',logincheck,(req, res) => {
    res.clearCookie("token");
    res.json("logout successfull");
})
app.get("/api/logincheck", logincheck, (req, res) => {
    res.json({
        user: req.user,
        islogged: true
    })
})