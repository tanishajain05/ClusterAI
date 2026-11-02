import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    firebaseuid:{
        type:string,
        unique:true
    },
    name:String,
    email:String,
    avatar:String
} , {
    timestamps:true
})

const User=mongoose.model("User",userSchema);
export default User;
