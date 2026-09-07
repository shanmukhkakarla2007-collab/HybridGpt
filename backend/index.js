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




app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());


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
app.get("/api/threads", async (req, res) => {
    const allthreads = await threads.find({}).sort({ updatedat: -1 });
    res.json(allthreads);
})
app.get("/api/threads/:threadid", async (req, res) => {
    const { threadid } = req.params;
    const thread = await threads.findOne({ threadid });
    res.json(thread.messages);
})
app.delete("/api/threads/:threadid", async (req, res) => {
    const { threadid } = req.params;
    const deletedthread = await threads.findOneAndDelete({ threadid: threadid });
    res.json(deletedthread);
})
app.post("/api/chat", async (req, res) => {
    const { message, threadid } = req.body;
    let findthread = await threads.findOne({ threadid: threadid });
    if (!findthread) {
        const thread = new threads({
            threadid: threadid,
            title: message,
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
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
app.put("/api/threads/:threadid/unpin", async (req, res) => {
    const { threadid } = req.params;
    const updatedhread = await threads.findOneAndUpdate({ threadid: threadid }, { ispinned: false }, { new: true });
    res.json(updatedhread);
})
app.put("/api/threads/:threadid/pin", async (req, res) => {
    const { threadid } = req.params;
    const updatedhread = await threads.findOneAndUpdate({ threadid: threadid }, { ispinned: true }, { new: true });
    res.json(updatedhread);
})
app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const finduser = await users.findOne({ $or: [{ username: username }, { email: email }] });
    if (finduser) {
        console.log("user already exists");
        return res.json("user already exists");
    }
    const hashedpassword = await bcrypt.hash(
        password,
        Number(process.env.HASHCODE)
    );
    const newuser = new users({
        username: username,
        email: email,
        password: hashedpassword
    });
    await newuser.save();
    res.cookie("token", token(newuser._id, newuser.username));
    res.json("signup successfull");
});
app.post("/api/login",async (req,res)=>{
    const {username,password} = req.body;
    const finduser=await users.findOne({username:username});
    if(!finduser){
        return res.json("you should signup first");
    }
    const comparepassword=await bcrypt.compare(password,finduser.password);
    if(!comparepassword){
        return res.json("invalid username or password");
    }
    res.cookie("token", token(finduser._id, finduser.username));
    res.json("login successfull");
})