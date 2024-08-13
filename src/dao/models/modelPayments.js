import mongoose from "mongoose";

const collection = 'payments';

const comprobantesSchema = new mongoose.Schema({
    numeroComprobante: Number,
    montoAPagar: Number,
    tipoFactura: String
});

const retencionSchema = new mongoose.Schema({
    nombre: String,
    regimen: String,
    numero: Number,
    importe: Number,
    fecha: Date
});

const pagosSchema = new mongoose.Schema({
    numeroCheque: Number,
    banco: String,
    importe: Number,
    fechaVencimiento: Date,
    chequeUsado: Boolean
})

const paymentsSchema = new mongoose.Schema({
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
    importe: Number,
    fechaPago: Date,
    comprobantes: [comprobantesSchema],
    retenciones: [retencionSchema],
    pagos: [pagosSchema],
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

const paymentsModel = mongoose.model(collection, paymentsSchema);

export default paymentsModel;