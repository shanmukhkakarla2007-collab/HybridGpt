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
const { logincheck, signupvalidation, loginvalidation, chatvalidation } = require("./middlewares.js");
const expresserror = require("./expresserror.js");
const wrapasync = require("./wrapasync.js");


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



app.get("/api/threads", logincheck, wrapasync(async (req, res) => {
    const allthreads = await threads.find({ user: req.user.id }).sort({ updatedat: -1 });
    res.json(allthreads);
}))
app.get("/api/threads/:threadid", logincheck, wrapasync(async (req, res,next) => {
    const { threadid } = req.params;
    const thread = await threads.findOne({ threadid, user: req.user.id });
    if (!thread) {
        return next(new ExpressError("Thread not found", 404));
    }
    res.json(thread.messages);
}))
app.delete("/api/threads/:threadid", logincheck, wrapasync(async (req, res,next) => {
    const { threadid } = req.params;
    const deletedthread = await threads.findOneAndDelete({ threadid: threadid, user: req.user.id });
    if (!deletedthread) {
        return next(new ExpressError("Thread not found", 404));
    }
    res.json(deletedthread);
}))
app.post("/api/chat", logincheck, chatvalidation, wrapasync(async (req, res,next) => {
    const { message, threadid } = req.body;
    let findthread = await threads.findOne({ threadid: threadid, user: req.user.id });
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
            user: req.user.id
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
}))
app.put("/api/threads/:threadid/unpin", logincheck, wrapasync(async (req, res,next) => {
    const { threadid } = req.params;
    const updatedhread = await threads.findOneAndUpdate({ threadid: threadid, user: req.user.id }, { ispinned: false }, { new: true });
    if(!updatedhread){
        return next(new ExpressError("Thread not found", 404));
    }
    res.json(updatedhread);
}))
app.put("/api/threads/:threadid/pin", logincheck, async (req, res,next) => {
    console.log("pin route is hitted");
    const { threadid } = req.params;
    const updatedhread = await threads.findOneAndUpdate({ threadid: threadid, user: req.user.id }, { ispinned: true }, { new: true });
    if(!updatedhread){
        return next(new ExpressError("Thread not found", 404));
    }
    res.json(updatedhread);
})
app.post("/api/signup", signupvalidation,wrapasync(async (req, res,next) => {
    const { username, email, password } = req.body;
    const finduser = await users.findOne({ $or: [{ username: username }, { email: email }] });
    if (finduser) {
        return next(new expresserror("user already exists",409));
    }
    const hashedpassword = await bcrypt.hash(
        password,
        10
    );
    const newuser = new users({
        username: username,
        email: email,
        password: hashedpassword
    });
    await newuser.save();
    res.cookie("token", token(newuser._id, newuser.username));
    res.json("signup successfull");
}));
app.post("/api/login", loginvalidation, wrapasync(async (req, res,next) => {
    const { username, password } = req.body;
    const finduser = await users.findOne({ username: username });
    if (!finduser) {
        return next(new expresserror("you should signup first",404));
    }
    const comparepassword = await bcrypt.compare(password, finduser.password);
    if (!comparepassword) {
        return next(new expresserror("invalid username or password",401));
    }
    res.cookie("token", token(finduser._id, finduser.username));
    res.json("login successfull");
}))
app.get('/api/logout', logincheck, (req, res) => {
    res.clearCookie("token");
    res.json("logout successfull");
})
app.get("/api/logincheck", logincheck, (req, res) => {
    res.json({
        user: req.user,
        islogged: true
    })
})


app.use((req,res,next)=>{
    return next(new expresserror("Invalid request",404));
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).json(message);
})