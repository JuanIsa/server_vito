import mongoose from "mongoose";

const collection = 'listtypeusers';

const userSchema = new mongoose.Schema({
    listTypeUsers:Array
    },
    { versionKey: false }
);

const userModelList = mongoose.model(collection, userSchema);

export default userModelList;