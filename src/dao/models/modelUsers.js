import { response } from "express";
import mongoose from "mongoose";

const collection = 'userTypes';


const userSchema = new mongoose.Schema({
    idUser: {
        type: Number,
        require: true,
        unique:false,
    },
    role: {
        type:String,
        require: true
    },
    creationDate:{
        type: String,
    }
    }, 
    { versionKey: false }
);

const userModel = mongoose.model(collection, userSchema);

export default userModel;