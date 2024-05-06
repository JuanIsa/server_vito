import mongoose from "mongoose";

const collection = 'listtypeusers';

const userSchema = new mongoose.Schema({
    active: Boolean,
    idType: {
        type: Number,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        unique: true 
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

const userModelList = mongoose.model(collection, userSchema);

export default userModelList;