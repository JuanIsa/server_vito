import mongoose from "mongoose";

const collection = 'notasdebito';

const detalleNotaDebitoSchema = new mongoose.Schema({
    descripcion: String,
    importe: Number,
    iva: Number
});

const comprobantesAsociadosSchema = new mongoose.Schema({
    tipoComprobante: {
        type: String,
        required: true
    },
    numeroComprobante: {
        type: Number,
        required: true
    },
    puntoVenta: {
        type: Number,
        required: true
    }
});

const debitNoteSchema = new mongoose.Schema({
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
        observaciones: {
            type: String,
            required: true
        },
        tipoNotaDebito: {
            type: String,
            required: true
        },
        idTipoNotaDebito: {
            type: Number,
            required: true
        },
        numeroNotaDebito: {
            type: Number,
            required: true
        },
        puntoVenta: {
            type: Number,
            required: true
        },
        importe: {
            type: Number,
            required: true
        },
        fechaNotaDebito: Date,
        detallesNotaDebito: [detalleNotaDebitoSchema],
        comprobantesAsociados: [comprobantesAsociadosSchema],
        cae: {
            type: String,
            required: true
        },
        fechaVencimientoCae: Date,
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
    { versionKey: false }
);

const debitNoteModel = mongoose.model(collection, debitNoteSchema);

export default debitNoteModel;