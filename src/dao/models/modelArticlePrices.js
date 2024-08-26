import mongoose from "mongoose";

const collection = 'articleprices';

const detallesArticulos = new mongoose.Schema({
    idArticulo: Number,
    precio: Number,
    porcentajeAumento: Number
});

const articlePricesSchema = new mongoose.Schema({
    active: Boolean,
    id: {
        type: Number,
        required: true,
        unique: true
    },
    observaciones: String,
    fecha: Date,
    porcentaje: Number,
    articulos: [detallesArticulos],
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

const articlePricesModel = mongoose.model(collection, articlePricesSchema);

export default articlePricesModel;