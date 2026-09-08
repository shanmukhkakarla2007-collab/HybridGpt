
const mongoose=require("mongoose");
const schema=mongoose.Schema;

const threadschema=new schema({
    threadid:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,
        default:"New Title",
        required:true
    },
    ispinned:{
        type:Boolean,
        default:false
    },
    messages:[{
        role:{
            type:String,
            enum:["user","assistant"],
            required:true
        },
        content:{
            type:String,
            required:true
        },
        timestamp:{
            type:Date,
            default:Date.now
        }
    }],
    createdat:{
        type:Date,
        default:Date.now
    },
    updatedat:{
        type:Date,
        default:Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
})

const threads=mongoose.model("thread",threadschema);
module.exports=threads;