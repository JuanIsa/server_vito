import mongoose from "mongoose";

const collection = 'notascredito';

const detalleNotaCreditoSchema = new mongoose.Schema({
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

const creditNoteSchema = new mongoose.Schema({
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
        tipoNotaCredito: {
            type: String,
            required: true
        },
        idTipoNotaCredito: {
            type: Number,
            required: true
        },
        numeroNotaCredito: {
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
        fechaNotaCredito: Date,
        detallesNotaCredito: [detalleNotaCreditoSchema],
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

const creditNoteModel = mongoose.model(collection, creditNoteSchema);

export default creditNoteModel;