import mongoose from "mongoose";

const collection = 'facturas';

const detalleFacturaSchema = new mongoose.Schema({
    idArticulo: Number,
    cantidad: Number,
    precioUnitario: Number,
    descuento: Number
});

const ticketSchema = new mongoose.Schema({
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
        descuento: Number,
        observaciones: {
            type: String,
            required: true
        },
        tipoFactura: {
            type: String,
            required: true
        },
        idTipoFactura: {
            type: Number,
            required: true
        },
        numeroFactura: {
            type: Number,
            required: true
        },
        puntoVenta: {
            type: Number,
            required: true
        },
        subtotalSinIva: {
            type: Number,
            required: true
        },
        iva: {
            type: Number,
            required: true
        },
        totalConIva: {
            type: Number,
            required: true
        },
        fechaFactura: Date,
        detallesFactura: [detalleFacturaSchema],
        cae: {
            type: String,
            required: true
        },
        pagado: {
            type: Boolean,
            default: false
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

const ticketModel = mongoose.model(collection, ticketSchema);

export default ticketModel;