import clientModel from './models/modelClient.js';
import FuncionesComunes from './handleCommonFunctions.js';
import DataBase from './handleDataBase.js';
import Administracion from './handleAdministration.js';

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
}
export default Clients