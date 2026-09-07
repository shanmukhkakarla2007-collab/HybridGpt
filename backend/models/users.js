const mongoose=require("mongoose");
const schema=mongoose.Schema;

const userschema=new schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});

const users=mongoose.model("user",userschema);
module.exports=users;