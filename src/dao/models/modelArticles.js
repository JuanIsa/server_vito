import mongoose from "mongoose";

const collection = 'articletypes';

const medidaSchema = new mongoose.Schema({
    alto: Number,
    ancho: Number,
    profundidad: Number
})

const articleSchema = new mongoose.Schema({
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
    nombreAnterior: String,
    descripcion: String,
    tipoArticulo: String,
    medidas: {
        type: medidaSchema,
    },
    relacionesArticulos: [Number],
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

const articleModel = mongoose.model(collection, articleSchema);

export default articleModel;