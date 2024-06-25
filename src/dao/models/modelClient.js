import mongoose from "mongoose";

const collection = 'clients';

const contactSchema = new mongoose.Schema({
    nombre : String,
    telefono: String,
    celular: String,
    email: String
});

const clientSchema = new mongoose.Schema({
    active: Boolean,
    id: {
        type: Number,
        required: true,
        unique: true
    },
    clientName: {
        type: String,
        required: true,
        unique: true 
    },
    fantasyName : {
        type: String,
        required: true,
        unique: true
    },
    streetName: {
        type: String,
        required: true
    },
    streetNumber: {
        type: Number
    },
    location: String,
    stateName: {
        type: String
    },
    cpNumber: {
        type: Number
    },
    cuitNumber: {
        type: String
    },
    ivaType: {
        type: String
    },
    transportData: {
        type: {
            name: String,
            observations: String
        }
    },
    contactData: [contactSchema],
    imported: Boolean,
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

const clientModel = mongoose.model(collection, clientSchema);

export default clientModel;