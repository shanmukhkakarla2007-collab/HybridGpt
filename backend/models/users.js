const mongoose=require("mongoose");
const schema=mongoose.Schema;

const userschema=new schema({
     username: {
        type: String,
        required: [true, "Username is required"],
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email"
        ]
    }
});

const users=mongoose.model("user",userschema);
module.exports=users;