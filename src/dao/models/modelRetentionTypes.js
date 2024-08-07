import mongoose from "mongoose";

const collection = 'retentionTypes';

const retentionTypesSchema = new mongoose.Schema({
        active: Boolean,
        id: {
            type: Number,
            required: true,
            unique: true
        },
        nombre: {
            type: String,
            required: true,
            unique: true
        },
        creationData: {
            type: {
                date: String,
                responsible: String,
            }
        },
        modificationData: {
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

const retentionTypesModel = mongoose.model(collection, retentionTypesSchema);

export default retentionTypesModel;