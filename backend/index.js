if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}
const express= require("express");
const app=express();
const port=8000;
const mongoose =require('mongoose');
const threads=require("./models/threads.js");
const gptmodel=require('./utils/gptmodel.js');

app.use(express.json());

async function connect(){
    await mongoose.connect(process.env.MONGODB_URL);
}
app.listen(port,()=>{
  console.log(`Server is running at ${port}`);
  connect()
    .then(()=>{
        console.log("Databse is connect succesfully")
    })
    .catch((err)=>{
        console.log("Database connection is unsuccessfull",err);
    })
})



app.get("/api/testdb",async(req,res)=>{
    const thread=new threads({
        threadid:12,
        title:"test thread",
        messages:[
            {
                role:"user",
                content:"what is 3+1?"
            },
            {
                role:"assistant",
                content:"its 4"
            }
        ]
    });
    const response =await thread.save();
    res.json(response);
})
app.get("/api/threads",async(req,res)=>{
    const allthreads=await threads.find({}).sort({updatedat:-1});
    res.json(allthreads);
})
app.get("/api/threads/:threadid",async (req,res)=>{
    const {threadid}=req.params;
    const thread=await threads.findOne({threadid});
    res.json(thread.messages);
})
app.delete("/api/threads/:threadid",async (req,res)=>{
    const {threadid}=req.params;
    const deletedthread=await threads.findOneAndDelete({threadid:threadid});
    res.json(deletedthread);
})
app.post("/api/chat",async(req,res)=>{
    const {message,threadid}=req.body;
    let findthread=await threads.findOne({threadid:threadid});
    if(!findthread){
        const thread=new threads({
            threadid:threadid,
            title:message,
            messages:[
                {
                    role:"user",
                    content:message
                }
            ]
        });
        findthread=thread;
    }
    else{
        findthread.messages.push(
            {
                role:"user",
                content:message
            },
        );
    }
    const gptmodelresponse=await gptmodel(message);
    findthread.messages.push(
        {
            role:"assistant",
            content:gptmodelresponse
        }
    );
    findthread.updatedat=Date.now();
    await findthread.save();
    res.json(gptmodelresponse);
})