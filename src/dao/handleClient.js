import clientModel from './models/modelClient.js';
import FuncionesComunes from './handleCommonFunctions.js';
import DataBase from './handleDataBase.js';
import Administracion from './handleAdministration.js';
import Afip from '@afipsdk/afip.js';
import ConstantesAfip from '../assets/afipglobals.js';

const dataBase = new DataBase();

class Clients {
    async createClient(data) {
        const clienteExistente = await clientModel.findOne({ clientName : data.nombreCliente });

        if(clienteExistente && (data.idCliente == 0 || data.idCliente != clienteExistente.id)) {
            throw new Error('Ya existe un cliente con este nombre.');
        }

        if(data.idCliente == 0) {
            let ultimoIdCliente = await dataBase.findLastId(clientModel) + 1;

            return await clientModel.create({
                active: true,
                id: ultimoIdCliente, 
                clientName : data.nombreCliente,
                fantasyName : data.nombreFantasia,
                streetName : data.direccion,
                streetNumber : data.numeroDireccion,
                location : data.localidad,
                stateName : data.provincia,
                cpNumber : data.codigoPostal,
                cuitNumber : data.cuit,
                ivaType : data.iva,
                transportData : {
                    name : data.transporte,
                    observations : data.observacionesTransporte,
                    transportDate : FuncionesComunes.getDate()
                },
                contactData : data.contactos,
                creationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                modificationData: {date:"",responsible:""},
                deleteData: {date:"",responsible:""}
            })
            //Deuelvo los datos de la creación o del error al front
            .then(data => data)
            .catch(e => e)
        } else {
            return await clientModel.findOneAndUpdate(
                {id: data.idCliente},
                {
                    active: true,
                    clientName : data.nombreCliente,
                    fantasyName : data.nombreFantasia,
                    streetName : data.direccion,
                    streetNumber : data.numeroDireccion,
                    location : data.localidad,
                    stateName : data.provincia,
                    cpNumber : data.codigoPostal,
                    cuitNumber : data.cuit,
                    ivaType : data.iva,
                    transportData : {
                        name : data.transporte,
                        observations : data.observacionesTransporte,
                        transportDate : FuncionesComunes.getDate()
                    },
                    contactData : data.contactos,
                    modificationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                },
                {new: true}
            )
            .then(data => data)
            .catch(e => e)
        }
    }

    async clientList() {
        return await clientModel.find().sort({clientName: 1})
        .then(data => data)
        .catch(e => e)
    }

    async changeStatusClient(data){
        return await clientModel.findOneAndUpdate({id: data.idCliente}, {active: data.estado}, { new: true })
        .then(data => data)
        .catch(e => e)
    }

    async getIvaTypes() {
        return await Administracion.obtenerTiposIva();
    }

    async getClient(params) {
        return await clientModel.findOne({id : params.id})
    }

    async getClientId(name) {
        return await clientModel.findOne({clientName: name})
    }

    async getStateList () {
        return await Administracion.obtenerListaProvincias();
    }

    async clientCreateTicket() {
        const afip = new Afip({ CUIT: 20409378472 });

        const punto_de_venta = 1;

        /**
         * Tipo de factura
         **/
        const tipo_de_factura = 1; // 1 = Factura A
        
        /**
         * Número de la ultima Factura A
         **/
        const last_voucher = await afip.ElectronicBilling.getLastVoucher(punto_de_venta, tipo_de_factura);

        console.log(last_voucher);

        /**
         * Concepto de la factura
         *
         * Opciones:
         *
         * 1 = Productos 
         * 2 = Servicios 
         * 3 = Productos y Servicios
         **/
        const concepto = 1;

        /**
         * Tipo de documento del comprador
         *
         * Opciones:
         *
         * 80 = CUIT 
         * 86 = CUIL 
         * 96 = DNI
         * 99 = Consumidor Final 
         **/
        const tipo_de_documento = ConstantesAfip.TiposDocumento.TIPO_DOC_CUIT;

        /**
         * Numero de documento del comprador (0 para consumidor final)
         **/
        const numero_de_documento = 33693450239;

        /**
         * Numero de factura
         **/
        const numero_de_factura = last_voucher+1;

        /**
         * Fecha de la factura en formato aaaa-mm-dd (hasta 10 dias antes y 10 dias despues)
         **/
        const fecha = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];

        /**
         * Importe sujeto al IVA (sin icluir IVA)
         **/
        const importe_gravado = 100;

        /**
         * Importe exento al IVA
         **/
        const importe_exento_iva = 0;

        /**
         * Importe de IVA
         **/
        const importe_iva = 21;

        /**
         * Los siguientes campos solo son obligatorios para los conceptos 2 y 3
         **/
        
        let fecha_servicio_desde = null, fecha_servicio_hasta = null, fecha_vencimiento_pago = null;
        
        if (concepto === ConstantesAfip.TiposConceptos.CONCEPTO_SERVICIOS || 
            concepto === ConstantesAfip.TiposConceptos.CONCEPTO_AMBOS ) {
            /**
             * Fecha de inicio de servicio en formato aaaammdd
             **/
            const fecha_servicio_desde = 20191213;

            /**
             * Fecha de fin de servicio en formato aaaammdd
             **/
            const fecha_servicio_hasta = 20191213;

            /**
             * Fecha de vencimiento del pago en formato aaaammdd
             **/
            const fecha_vencimiento_pago = 20191213;
        }

        const data = {
            'CantReg' 	: 1, // Cantidad de facturas a registrar
            'PtoVta' 	: punto_de_venta,
            'CbteTipo' 	: tipo_de_factura, 
            'Concepto' 	: concepto,
            'DocTipo' 	: tipo_de_documento,
            'DocNro' 	: numero_de_documento,
            'CbteDesde' : numero_de_factura,
            'CbteHasta' : numero_de_factura,
            'CbteFch' 	: parseInt(fecha.replace(/-/g, '')),	
            'FchServDesde'  : fecha_servicio_desde,
            'FchServHasta'  : fecha_servicio_hasta,
            'FchVtoPago'    : fecha_vencimiento_pago,
            'ImpTotal' 	: importe_gravado + importe_iva + importe_exento_iva,
            'ImpTotConc': 0, // Importe neto no gravado
            'ImpNeto' 	: importe_gravado,
            'ImpOpEx' 	: importe_exento_iva,
            'ImpIVA' 	: importe_iva,
            'ImpTrib' 	: 0, //Importe total de tributos
            'MonId' 	: 'PES', //Tipo de moneda usada en la factura ('PES' = pesos argentinos) 
            'MonCotiz' 	: 1, // Cotización de la moneda usada (1 para pesos argentinos)  
            'Iva' 		: [ // Alícuotas asociadas a la factura
                {
                    'Id' 		: ConstantesAfip.TiposIva.TIPO_IVA_21, // Id del tipo de IVA (5 = 21%)
                    'BaseImp' 	: importe_gravado,
                    'Importe' 	: importe_iva 
                }
            ]
        };

        /** 
         * Creamos la Factura 
         **/
        const res = await afip.ElectronicBilling.createVoucher(data);

        /**
         * Mostramos por pantalla los datos de la nueva Factura 
         **/
        console.log({
            'cae' : res.CAE, //CAE asignado a la Factura
            'vencimiento' : res.CAEFchVto //Fecha de vencimiento del CAE
        });
    }
}
export default Clients