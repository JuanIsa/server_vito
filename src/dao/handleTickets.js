import FuncionesComunes from './handleCommonFunctions.js'
import DataBase from './handleDataBase.js';
import Afip from '@afipsdk/afip.js';
import ConstantesAfip from '../assets/afipglobals.js';
import Clients from './handleClient.js';
import Articles from './handleArticles.js';
import ticketModel from './models/modelTicket.js';
import paymentsModel from './models/modelPayments.js';
import creditNoteModel from './models/modelCreditNote.js';

const dataBase = new DataBase();
const clients = new Clients();
const articles = new Articles();

class Tickets {
    async getLastCAE(data) {
        const afip = new Afip({ CUIT: ConstantesAfip.DatosEmpresa.CUIT });
        const puntoDeVenta = 1;

        let tipoComprobanteAfip = 0;

        if(data.comprobante == 'FACTURA A') {
            tipoComprobanteAfip = ConstantesAfip.TiposComprobante.TIPO_FACTURA_A;
        } else if(data.comprobante == 'FACTURA B') {
            tipoComprobanteAfip = ConstantesAfip.TiposComprobante.TIPO_FACTURA_B;
        } else if(data.comprobante == 'FACTURA C') {
            tipoComprobanteAfip = ConstantesAfip.TiposComprobante.TIPO_FACTURA_C;
        } else if(data.comprobante == 'NOTA DE CRÉDITO A') {
            tipoComprobanteAfip = ConstantesAfip.TiposComprobante.TIPO_NOTA_CREDITO_A;
        } else if(data.comprobante == 'NOTA DE CRÉDITO B') {
            tipoComprobanteAfip = ConstantesAfip.TiposComprobante.TIPO_NOTA_CREDITO_B;
        } else if(data.comprobante == 'NOTA DE CRÉDITO C') {
            tipoComprobanteAfip = ConstantesAfip.TiposComprobante.TIPO_NOTA_CREDITO_C;
        } else if(data.comprobante == 'NOTA DE DÉBITO A') {
            tipoComprobanteAfip = ConstantesAfip.TiposComprobante.TIPO_NOTA_DEBITO_A;
        } else if(data.comprobante == 'NOTA DE DÉBITO B') {
            tipoComprobanteAfip = ConstantesAfip.TiposComprobante.TIPO_NOTA_DEBITO_B;
        } else if(data.comprobante == 'NOTA DE DÉBITO C') {
            tipoComprobanteAfip = ConstantesAfip.TiposComprobante.TIPO_NOTA_DEBITO_C;
        }

        const ultimoIdCAE = await afip.ElectronicBilling.getLastVoucher(puntoDeVenta, tipoComprobanteAfip);

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
        let numeroIdentificacion = datosCliente.cuitNumber;

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
            'PtoVta' 	    : datosFactura.puntoVenta,
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
        let ultimoNumeroFactura = await this.obtenerUltimoNumeroFactura(tipoFactura, datosFactura.puntoVenta) + 1;

        return await ticketModel.create({
            active: true,
            id: ultimoIdFactura,
            idCliente: datosFactura.idCliente,
            idTipoFactura: tipoFactura,
            puntoVenta: datosFactura.puntoVenta,
            numeroFactura: ultimoNumeroFactura,
            tipoFactura: nombreTipoFactura,
            fechaFactura: datosFactura.fecha,
            subtotalSinIva: parseFloat(datosFactura.resultadoFactura.subtotalDescuento.toFixed(2)),
            iva: parseFloat(datosFactura.resultadoFactura.IVA.toFixed(2)),
            totalConIva: (parseFloat(datosFactura.resultadoFactura.subtotalDescuento.toFixed(2)) + parseFloat(datosFactura.resultadoFactura.IVA.toFixed(2)) + parseFloat(importe_exento_iva.toFixed(2))).toFixed(2),
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
        .then(() => {
            let datosCuentaCorriente = {
                id: 0,
                tipoConcepto: nombreTipoFactura,
                idConcepto: ultimoIdFactura,
                puntoVenta: datosFactura.puntoVenta,
                numeroComprobante: ultimoNumeroFactura,
                debe: (parseFloat(datosFactura.resultadoFactura.subtotalDescuento.toFixed(2)) + parseFloat(datosFactura.resultadoFactura.IVA.toFixed(2)) + parseFloat(importe_exento_iva.toFixed(2))).toFixed(2),
                haber: 0.0,
                observaciones: datosFactura.observaciones,
                fecha: datosFactura.fecha
            }
    
            datosCliente.currentAccount.push(datosCuentaCorriente);
    
            return datosCliente.save();
        })
        .catch(e => e)
    }

    async obtenerUltimoNumeroFactura(tipoFactura, puntoVenta) {
        const facturas = await ticketModel.findOne({ idTipoFactura: tipoFactura, puntoVenta: puntoVenta }).sort({ id: -1 });

        if(facturas.numeroFactura) {
            return facturas.numeroFactura;
        }

        return 0;
    }

    async obtenerUltimoNumeroNotaCredito(tipoNotaCredito, puntoVenta) {
        const notaCredito = await creditNoteModel.findOne({ idTipoNotaCredito: tipoNotaCredito, puntoVenta: puntoVenta }).sort({ id: -1 });

        if(notaCredito && notaCredito.numeroNotaCredito) {
            return notaCredito.numeroNotaCredito;
        }

        return 0;
    }

    async getTickets(params) {
        let filtros = {};

        if (params.fechaDesde) {
            filtros.fechaFactura = {
                $gte: new Date(params.fechaDesde),
                $lte: new Date(params.fechaHasta)
            };
        }

        if (params.cliente) {
            const datosCliente = await clients.getClientId(params.cliente);
            filtros.idCliente = datosCliente.id;
        }

        return await ticketModel.find(filtros)
            .then( async data => {
                let respuesta = await Promise.all(data.map(async datosFactura => {
                    const datosCliente = await clients.getClient({id : datosFactura.idCliente});

                    let montoFactura = 0.0;

                    let articulos = await Promise.all(datosFactura.detallesFactura.map(async articulo => {
                        const datosArticulo = await articles.getArticle({idArticulo : articulo.idArticulo});

                        let articuloActual = {
                            id: articulo.idArticulo,
                            nombreArticulo: datosArticulo.nombre,
                            cantidad: articulo.cantidad,
                            precioUnitario: articulo.precioUnitario
                        };

                        montoFactura += (articuloActual.cantidad * articuloActual.precioUnitario);

                        return articuloActual;
                    }));

                    montoFactura = montoFactura * (1 - datosFactura.descuento / 100);

                    let subtotalSinIva = montoFactura;
                    let importeIva = subtotalSinIva * 0.21;
                    let totalConIva = subtotalSinIva + importeIva;

                    if(datosFactura.subtotalSinIva) {
                        subtotalSinIva = datosFactura.subtotalSinIva;
                    }

                    if(datosFactura.iva) {
                        importeIva = datosFactura.iva;
                    }

                    if(datosFactura.totalConIva) {
                        totalConIva = datosFactura.totalConIva;
                    }
                    
                    let facturaActual = {
                        id: datosFactura.id,
                        idCliente: datosFactura.idCliente,
                        nombreCliente: datosCliente.clientName,
                        montoTotal: montoFactura,
                        observaciones: datosFactura.observaciones,
                        tipoFactura: datosFactura.tipoFactura,
                        descuento: datosFactura.descuento,
                        cae: datosFactura.cae,
                        detallesFactura: articulos,
                        subtotalSinIva: subtotalSinIva,
                        iva: importeIva,
                        totalConIva: totalConIva,
                        fechaFactura: datosFactura.fechaFactura,
                        puntoVenta: datosFactura.puntoVenta,
                        numeroFactura: datosFactura.numeroFactura
                    }

                    return facturaActual;
                }));
                
                return respuesta;
            })
            .catch();
    }

    async getUnpaidTickets(params) {
        let filtros = {
            $or: [
                { pagado: { $exists: false } },
                { pagado: false } 
            ]
        };

        if(params.cliente) {
            const datosCliente = await clients.getClientId(params.cliente);
            filtros.idCliente = datosCliente.id;
        }

        return await ticketModel.find(filtros)
            .then(async data => {
                let respuesta = await Promise.all(data.map(async datosFactura => {
                    const datosCliente = await clients.getClient({id : datosFactura.idCliente});

                    let montoFactura = 0.0;

                    await Promise.all(datosFactura.detallesFactura.map(async articulo => {
                        montoFactura += (articulo.cantidad * articulo.precioUnitario);
                    }));

                    montoFactura = montoFactura * (1 - datosFactura.descuento / 100);

                    let subtotalSinIva = montoFactura;
                    let importeIva = subtotalSinIva * 0.21;

                    if(datosFactura.subtotalSinIva) {
                        subtotalSinIva = datosFactura.subtotalSinIva;
                    }

                    if(datosFactura.iva) {
                        importeIva = datosFactura.iva;
                    }

                    if(datosFactura.totalConIva) {
                        montoFactura = datosFactura.totalConIva;
                    } else {
                        montoFactura = subtotalSinIva + importeIva;
                    }

                    montoFactura -= await this.obtenerMontoTotalPagadoComprobante(datosFactura.id);
                    montoFactura -= await this.obtenerMontoTotalNotasCreditoComprobante(datosFactura.puntoVenta, datosFactura.numeroFactura);

                    let facturaActual = {
                        id: datosFactura.id,
                        idCliente: datosFactura.idCliente,
                        nombreCliente: datosCliente.clientName,
                        montoTotal: montoFactura,
                        observaciones: datosFactura.observaciones,
                        tipoFactura: datosFactura.tipoFactura,
                        cae: datosFactura.cae,
                        fechaFactura: datosFactura.fechaFactura,
                        puntoVenta: datosFactura.puntoVenta,
                        numeroFactura: datosFactura.numeroFactura
                    }

                    return facturaActual;
                }));

                return respuesta;
            })
            .catch();
    }

    async createPayment(params) {
        let ultimoIdPago = await dataBase.findLastId(paymentsModel) + 1;
        let datosCliente = await clients.getClientId(params.cliente);

        if(params.idPago == 0) {
            return await paymentsModel.create({
                active: true,
                id: ultimoIdPago,
                idCliente: datosCliente.id,
                importe: params.totalAPagar,
                pagos: params.pagos,
                fechaPago: new Date(),
                retenciones: params.retenciones,
                comprobantes: params.comprobantes,                           
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
            .then(data => {                
                params.comprobantes.forEach(async comprobanteActual => {
                    let datosCuentaCorriente = {
                        id: 0,
                        tipoConcepto: 'PAGO FACTURA',
                        idConcepto: ultimoIdPago,
                        debe: 0.0,
                        haber: comprobanteActual.montoAPagar,
                        observaciones: '',
                        fecha: new Date(),
                        puntoVenta: comprobanteActual.puntoVenta,
                        numeroComprobante: comprobanteActual.numeroFactura
                    }
        
                    datosCliente.currentAccount.push(datosCuentaCorriente);

                    await this.actualizarTotalPagadoComprobante(comprobanteActual.numeroComprobante);
                })
                
                datosCliente.save();

                return data;
            })
            .catch(e => e)
        } else {

        }
    }

    async obtenerMontoTotalPagadoComprobante(numeroComprobante) {
        const pagos = await paymentsModel.aggregate([
            { $unwind: "$comprobantes" },
            { $match: { "comprobantes.numeroComprobante": numeroComprobante } },
            { $group: {
                _id: null,
                totalPagado: { $sum: "$comprobantes.montoAPagar" }
            }}
        ]);

        return pagos.length > 0 ? pagos[0].totalPagado : 0;
    }

    async obtenerMontoTotalNotasCreditoComprobante(puntoVenta, numeroComprobante) {
        const notasCredito = await creditNoteModel.aggregate([
            { $match: { "comprobantesAsociados.puntoVenta": puntoVenta, "comprobantesAsociados.numeroComprobante": numeroComprobante } },
            { $group: {
                _id: null,
                totalNotasCredito: { $sum: "$importe" }
            }}
        ]);

        return notasCredito.length > 0 ? notasCredito[0].totalNotasCredito : 0;
    }

    async actualizarTotalPagadoComprobante(numeroComprobante) {
        const factura = await ticketModel.findOne({ id: numeroComprobante }).exec();
        
        let totalAntesDescuento = 0;
        factura.detallesFactura.forEach(detalle => {
            const subtotalArticulo = detalle.cantidad * detalle.precioUnitario;
            totalAntesDescuento += subtotalArticulo - detalle.descuento;
        });
        
        
        const totalPagadoFactura = await this.obtenerMontoTotalPagadoComprobante(numeroComprobante);
        const totalNotasCreditoFactura = await this.obtenerMontoTotalNotasCreditoComprobante(factura.puntoVenta, factura.numeroFactura);

        const totalConDescuento = totalAntesDescuento * (1 - factura.descuento / 100);
        
        let subtotalSinIva = totalConDescuento;
        let importeIva = subtotalSinIva * 0.21;
        let totalConIva = subtotalSinIva + importeIva;

        if(factura.subtotalSinIva) {
            subtotalSinIva = factura.subtotalSinIva;
        }

        if(factura.iva) {
            importeIva = factura.iva;
        }

        if(factura.totalConIva) {
            totalConIva = factura.totalConIva;
        }

        const totalFactura = Math.max(totalConIva, 0);

        let pagado = false;

        if(Math.abs(totalFactura - totalPagadoFactura - totalNotasCreditoFactura) < 0.01 ) {
            pagado = true; 
        }

        return await ticketModel.updateOne(
            { id: numeroComprobante }, 
            { $set: { pagado: pagado } } 
        );
    }

    async getPayments(params) {
        let filtros = {};

        if (params.fechaDesde) {
            filtros.fechaFactura = {
                $gte: new Date(params.fechaDesde),
                $lte: new Date(params.fechaHasta)
            };
        }

        if (params.cliente) {
            const datosCliente = await clients.getClientId(params.cliente);
            filtros.idCliente = datosCliente.id;
        }

        return await paymentsModel.find(filtros)
            .then( async data => {
                let respuesta = await Promise.all(data.map(async datosCobranza => {
                    const datosCliente = await clients.getClient({id : datosCobranza.idCliente});
                    
                    let cobranzaActual = {
                        id: datosCobranza.id,
                        idCliente: datosCobranza.idCliente,
                        nombreCliente: datosCliente.clientName,
                        fechaPago: datosCobranza.fechaPago,
                        importe: datosCobranza.importe,
                        observaciones: datosCobranza.observaciones,
                        comprobantes: datosCobranza.comprobantes,
                        pagos: datosCobranza.pagos,
                        retenciones: datosCobranza.retenciones,
                    }
                    
                    return cobranzaActual;
                }));
                
                return respuesta;
            })
            .catch();
    }

    

    async generateCreditNote(datosNotaCredito) {
        const afip = new Afip({ CUIT: ConstantesAfip.DatosEmpresa.CUIT });
        let datosCliente = await clients.getClient({id: datosNotaCredito.idCliente});
        const fechaNotaCredito = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        let tipoNotaCredito = ConstantesAfip.TiposComprobante.TIPO_NOTA_CREDITO_A;
        let nombreTipoNotaCredito = 'NOTA DE CRÉDITO A';
        let tipoIdentificacion = ConstantesAfip.TiposDocumento.TIPO_DOC_CUIT;
        let numeroIdentificacion = datosCliente.cuitNumber;

        if(datosCliente.ivaType == 'EXENTO' || datosCliente.ivaType == 'CONSUMIDOR FINAL') {
            tipoNotaCredito = ConstantesAfip.TiposComprobante.TIPO_NOTA_CREDITO_B;
            nombreTipoNotaCredito = 'NOTA DE CRÉDITO B';
            tipoIdentificacion = ConstantesAfip.TiposDocumento.TIPO_DOC_CUIL;

            if(datosCliente.ivaType == 'CONSUMIDOR FINAL') {
                tipoIdentificacion = ConstantesAfip.TiposDocumento.TIPO_DOC_CONSUMIDOR_FINAL;
                numeroIdentificacion = ConstantesAfip.NumerosDocumento.NUMERO_DOCUMENTO_CONSUMIDOR_FINAL;
            }
        }
        
        let fechaServicioDesde = null, fechaServicioHasta = null, fechaVencimientoPago = null;

        let importeIva = 0.0;
        let detallesIva = [];
        let comprobantesAsociados = [];

        datosNotaCredito.itemsNotaCredito.forEach(itemNotaCredito => {
            let ivaItem = itemNotaCredito.importe * itemNotaCredito.iva / 100;
            importeIva += ivaItem;

            detallesIva.push({
                'Id' 		: this.tipoIvaSegunPorcentaje(itemNotaCredito.iva),
                'BaseImp' 	: itemNotaCredito.importe,
                'Importe' 	: ivaItem
            });
        });

        datosNotaCredito.comprobantesAsociados.forEach(comprobanteAsociado => {
            comprobantesAsociados.push({
                'Tipo' 		: ConstantesAfip.TiposComprobante.TIPO_FACTURA_A,
                'PtoVta' 	: comprobanteAsociado.puntoVenta,
                'Nro' 		: comprobanteAsociado.numeroComprobante
            });
        });

        const data = {
            'CantReg' 	    : 1, 
            'PtoVta' 	    : datosNotaCredito.puntoVenta,
            'CbteTipo' 	    : tipoNotaCredito, 
            'Concepto' 	    : ConstantesAfip.TiposConceptos.CONCEPTO_PRODUCTOS,
            'DocTipo' 	    : tipoIdentificacion,
            'DocNro' 	    : numeroIdentificacion,
            'CbteDesde'     : datosNotaCredito.cae,
            'CbteHasta'     : datosNotaCredito.cae,
            'CbteFch' 	    : parseInt(fechaNotaCredito.replace(/-/g, '')),	
            'FchServDesde'  : fechaServicioDesde,
            'FchServHasta'  : fechaServicioHasta,
            'FchVtoPago'    : fechaVencimientoPago,
            'ImpTotal' 	    : parseFloat(datosNotaCredito.resultadoFactura.subtotal.toFixed(2)),
            'ImpTotConc'    : 0, // Importe neto no gravado
            'ImpNeto' 	    : parseFloat(parseFloat(datosNotaCredito.resultadoFactura.subtotal.toFixed(2)) - parseFloat(importeIva).toFixed(2)).toFixed(2),
            'ImpOpEx' 	    : 0.0,
            'ImpIVA' 	    : importeIva,
            'ImpTrib' 	    : 0, //Importe total de tributos
            'MonId' 	    : ConstantesAfip.TiposMoneda.TIPO_MONEDA_PESO,
            'MonCotiz' 	    : ConstantesAfip.IdTiposMoneda.TIPO_MONEDA_PESO,   
            'Iva' 		    : detallesIva,
            'CbtesAsoc'     : comprobantesAsociados,
        };

        const res = await afip.ElectronicBilling.createVoucher(data);

        let ultimoIdNotaCredito = await dataBase.findLastId(creditNoteModel) + 1;
        let ultimoNumeroNotaCredito = await this.obtenerUltimoNumeroNotaCredito(tipoNotaCredito, datosNotaCredito.puntoVenta) + 1;

        return await creditNoteModel.create({
            active: true,
            id: ultimoIdNotaCredito,
            idCliente: datosNotaCredito.idCliente,
            idTipoNotaCredito: tipoNotaCredito,
            puntoVenta: datosNotaCredito.puntoVenta,
            numeroNotaCredito: ultimoNumeroNotaCredito,
            tipoNotaCredito: nombreTipoNotaCredito,
            fechaNotaCredito: datosNotaCredito.fecha,
            observaciones: datosNotaCredito.observaciones,
            importe: datosNotaCredito.resultadoFactura.subtotal,
            cae: res.CAE,
            vencimientoCae: res.CAEFchVto,
            detallesNotaCredito: datosNotaCredito.itemsNotaCredito,
            comprobantesAsociados: datosNotaCredito.comprobantesAsociados,
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
        .then(() => {
            let datosCuentaCorriente = {
                id: 0,
                tipoConcepto: nombreTipoNotaCredito,
                idConcepto: ultimoIdNotaCredito,
                puntoVenta: datosNotaCredito.puntoVenta,
                numeroComprobante: ultimoNumeroNotaCredito,
                debe: 0.0,
                haber: parseFloat(datosNotaCredito.resultadoFactura.subtotal.toFixed(2)),
                observaciones: datosNotaCredito.observaciones,
                fecha: datosNotaCredito.fecha
            }
    
            datosCliente.currentAccount.push(datosCuentaCorriente);
    
            return datosCliente.save();
        })
        .catch(e => e)
    }

    tipoIvaSegunPorcentaje(porcentaje) {
        if(porcentaje == 0) {
            return ConstantesAfip.TiposIVA.IVA_0; ;
        } else if(porcentaje == 10.5) {
            return ConstantesAfip.TiposIVA.IVA_10_5;
        } else if(porcentaje == 21) {
            return ConstantesAfip.TiposIVA.IVA_21;
        } else if(porcentaje == 27) {
            return ConstantesAfip.TiposIVA.IVA_27;
        } else if(porcentaje == 5) {
            return ConstantesAfip.TiposIVA.IVA_5;
        } else if(porcentaje == 2.5) {
            return ConstantesAfip.TiposIVA.IVA_2_5;
        }
    }
}
export default Tickets;