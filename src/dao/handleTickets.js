import FuncionesComunes from './handleCommonFunctions.js'
import DataBase from './handleDataBase.js';
import Afip from '@afipsdk/afip.js';
import ConstantesAfip from '../assets/afipglobals.js';
import Clients from './handleClient.js';
import ticketModel from './models/modelTicket.js';

const dataBase = new DataBase();
const clients = new Clients();

class Tickets {
    async getLastCAE() {
        const afip = new Afip({ CUIT: ConstantesAfip.DatosEmpresa.CUIT });
        const puntoDeVenta = 1;

        const ultimoIdCAE = await afip.ElectronicBilling.getLastVoucher(puntoDeVenta, ConstantesAfip.TiposComprobante.TIPO_FACTURA_A);

        let datosRespuesta = {
            ultimoIdCAE: ultimoIdCAE
        }

        return datosRespuesta;
    }

    async generateTicket(datosFactura) {
        const afip = new Afip({ CUIT: ConstantesAfip.DatosEmpresa.CUIT });
        let datosCliente = await clients.getClient({id: datosFactura.idCliente});
        const fechaFactura = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        let tipoFactura = ConstantesAfip.TiposComprobante.TIPO_FACTURA_A;
        let nombreTipoFactura = 'FACTURA A';
        let tipoIdentificacion = ConstantesAfip.TiposDocumento.TIPO_DOC_CUIT;
        let numeroIdentificacion = 33693450239;

        if(datosCliente.ivaType == 'EXENTO' || datosCliente.ivaType == 'CONSUMIDOR FINAL') {
            tipoFactura = ConstantesAfip.TiposComprobante.TIPO_FACTURA_B;
            nombreTipoFactura = 'FACTURA B';
            tipoIdentificacion = ConstantesAfip.TiposDocumento.TIPO_DOC_CUIL;

            if(datosCliente.ivaType == 'CONSUMIDOR FINAL') {
                tipoIdentificacion = ConstantesAfip.TiposDocumento.TIPO_DOC_CONSUMIDOR_FINAL;
                numeroIdentificacion = ConstantesAfip.NumerosDocumento.NUMERO_DOCUMENTO_CONSUMIDOR_FINAL;
            }
        }

        let tieneProductos = false;
        let tieneServicios = false;

        let articulosFacturados = [];

        datosFactura.articulosFacturados.forEach(articuloFacturado => {
            if(articuloFacturado.esServicio) {
                tieneServicios = true;
            } else {
                tieneProductos = true;
            }

            let articuloActual = {
                idArticulo: articuloFacturado.idArticulo,
                cantidad: articuloFacturado.cantidad,
                precioUnitario: articuloFacturado.precio,
                descuento: 0.0
            }

            articulosFacturados.push(articuloActual);
        });

        let concepto = ConstantesAfip.TiposConceptos.CONCEPTO_PRODUCTOS;

        if(tieneProductos && tieneServicios) {
            concepto = ConstantesAfip.TiposConceptos.CONCEPTO_AMBOS;   
        } else if(tieneServicios) {
            concepto = ConstantesAfip.TiposConceptos.CONCEPTO_SERVICIOS;
        }

        /**
         * Importe exento al IVA
         **/
        const importe_exento_iva = 0;
        
        let fechaServicioDesde = null, fechaServicioHasta = null, fechaVencimientoPago = null;
        
        if (concepto === ConstantesAfip.TiposConceptos.CONCEPTO_SERVICIOS || concepto === ConstantesAfip.TiposConceptos.CONCEPTO_AMBOS) {
            fechaServicioDesde = parseInt(FuncionesComunes.getDateAMD());
            fechaServicioHasta = parseInt(FuncionesComunes.getDateAMD());
            fechaVencimientoPago = parseInt(FuncionesComunes.getDateAMD()); // Corroborar fecha vencimiento pago, cuántos días son?
        }

        const data = {
            'CantReg' 	    : 1, 
            'PtoVta' 	    : ConstantesAfip.DatosEmpresa.PUNTO_VENTA,
            'CbteTipo' 	    : tipoFactura, 
            'Concepto' 	    : concepto,
            'DocTipo' 	    : tipoIdentificacion,
            'DocNro' 	    : numeroIdentificacion,
            'CbteDesde'     : datosFactura.cae,
            'CbteHasta'     : datosFactura.cae,
            'CbteFch' 	    : parseInt(fechaFactura.replace(/-/g, '')),	
            'FchServDesde'  : fechaServicioDesde,
            'FchServHasta'  : fechaServicioHasta,
            'FchVtoPago'    : fechaVencimientoPago,
            'ImpTotal' 	    : (parseFloat(datosFactura.resultadoFactura.subtotalDescuento.toFixed(2)) + parseFloat(datosFactura.resultadoFactura.IVA.toFixed(2)) + parseFloat(importe_exento_iva.toFixed(2))).toFixed(2),
            'ImpTotConc'    : 0, // Importe neto no gravado
            'ImpNeto' 	    : parseFloat(datosFactura.resultadoFactura.subtotalDescuento.toFixed(2)),
            'ImpOpEx' 	    : importe_exento_iva,
            'ImpIVA' 	    : parseFloat(datosFactura.resultadoFactura.IVA.toFixed(2)),
            'ImpTrib' 	    : 0, //Importe total de tributos
            'MonId' 	    : ConstantesAfip.TiposMoneda.TIPO_MONEDA_PESO,
            'MonCotiz' 	    : ConstantesAfip.IdTiposMoneda.TIPO_MONEDA_PESO,   
            'Iva' 		    : [ // Alícuotas asociadas a la factura
                {
                    'Id' 		: 5, // Id del tipo de IVA (5 = 21%)
                    'BaseImp' 	: parseFloat(datosFactura.resultadoFactura.subtotalDescuento.toFixed(2)),
                    'Importe' 	: parseFloat(datosFactura.resultadoFactura.IVA.toFixed(2)) 
                }
            ]
        };

        const res = await afip.ElectronicBilling.createVoucher(data);

        let ultimoIdFactura = await dataBase.findLastId(ticketModel) + 1;

        await ticketModel.create({
            active: true,
            id: ultimoIdFactura,
            idCliente: datosFactura.idCliente,
            idTipoFactura: tipoFactura,
            tipoFactura: nombreTipoFactura,
            fechaFactura: new Date(),
            descuento: datosFactura.descuento,
            observaciones: datosFactura.observaciones,
            cae: res.CAE,
            vencimientoCae: res.CAEFchVto,
            detallesFactura: articulosFacturados,            
            creationData: {
                date: FuncionesComunes.getDate(),
                responsible:"root"
            },
            modificationData: {
                date:"",
                responsible:""
            },
            deleteData: {
                date:"",
                responsible:""
            }
        })
        .then(data => data)
        .catch(e => e)

        let datosCuentaCorriente = {
            id: 0,
            tipoConcepto: nombreTipoFactura,
            idConcepto: ultimoIdFactura,
            debe: (parseFloat(datosFactura.resultadoFactura.subtotalDescuento.toFixed(2)) + parseFloat(datosFactura.resultadoFactura.IVA.toFixed(2)) + parseFloat(importe_exento_iva.toFixed(2))).toFixed(2),
            haber: 0.0,
            observaciones: datosFactura.observaciones,
            fecha: new Date()
        }

        datosCliente.currentAccount.push(datosCuentaCorriente);

        datosCliente.save();
    }
}
export default Tickets;