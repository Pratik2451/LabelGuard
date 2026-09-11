import { timeStamp } from "node:console";
import { type } from "node:os";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true 
    },
    username : {
        type : String , 
        required : true
    },
    password : {
        type : String , 
        required: true
    },
    fullName : {
        type : String
    },
    department : {
        type : String
    },
    designation : {
        type : String
    },
    refreshToken : {
        type : String
    }

},
    {
        timestamps : true
    }
)


//password hashing (using pre hook)
userSchema.pre("save" , async function () {
    if(!this.isModified("password"))  return ;

    this.password = await bcrypt.hash(this.password , 10);
})

//is password correct method 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User" , userSchema)