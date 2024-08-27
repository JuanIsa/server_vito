import mongoose from "mongoose";

const collection = 'notascredito';

const detalleNotaCreditoSchema = new mongoose.Schema({
    descripcion: String,
    importe: Number,
    iva: Number
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
        fechaNotaCredito: Date,
        detallesNotaCredito: [detalleNotaCreditoSchema],
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