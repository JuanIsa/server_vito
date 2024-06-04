import mongoose from "mongoose";

const collection = 'orders';

const articleSchema = new mongoose.Schema({
    idArticulo: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number, 
        required: true
    },
    accesorios: [Number]
})

const orderSchema = new mongoose.Schema({
    active: Boolean,
    id: {
        type: Number,
        required: true,
        unique: true
    },
    idCliente: {
        type: Number,
        required: true
    },
    fechaPedido: Date,
    estadoPedido: String,
    observaciones: String,
    transporte: String,
    observacionesTransporte: String,
    fechaCumplido: Date,
    fechaAnulado: Date,
    articulos: [articleSchema],
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

const orderModel = mongoose.model(collection, orderSchema);

export default orderModel;