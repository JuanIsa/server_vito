import mongoose from "mongoose";

const collection = 'clients';

const contactSchema = new mongoose.Schema({
    nombre : String,
    telefono: String,
    celular: String,
    email: String
});

const currentAccountSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    tipoConcepto: {
        type: String,
        required: true
    },
    idConcepto: {
        type: Number,
        required: true
    },
    numeroComprobante: {
        type: Number,
        required: true
    },
    puntoVenta: {
        type: Number,
        required: true
    },
    debe: {
        type: Number,
        required: true
    },
    haber: {
        type: Number,
        required: true
    },
    observaciones: String,
    fecha: Date
})

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
        contactData: {
            type: [contactSchema],
            default: []
        },
        imported: Boolean,
        currentAccount: [currentAccountSchema],
        creationData:{
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
        deleteData: {
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