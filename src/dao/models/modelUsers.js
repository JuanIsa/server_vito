import mongoose from "mongoose";

const collection = 'userTypes';

const userSchema = new mongoose.Schema({
    active: Boolean,
    idUser: {
        type: Number,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true 
    },
    password: String,
    role: {
        type: String,
        required: true
    },
    creationData:{
        type: {
            date: String,
            responsible: String,
        }
    },
    modificationData:{
        type: {
            date: String,
            responsible: String,
        }
    },
    deleteData:{
        type: {
            date: String,
            responsible: String,
        }
    }
    }, 
    //Control de versiones de documento, agrega un campo extra al documento.
    { versionKey: false }
);

const userModel = mongoose.model(collection, userSchema);

export default userModel;