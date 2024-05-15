import clientModel from './models/modelClient.js';
import FuncionesComunes from './handleCommonFunctions.js';

class Clients {
    async createClient(data) {
        const clienteExistente = await clientModel.findOne({ nombreCliente : data.nombreCliente });

        if(clienteExistente) {
            throw new Error('Ya existe un cliente con este nombre.');
        }

        let ultimoIdCliente = 1;

        const crearCliente = await clientModel.create({
            active: true,
            idClient: ultimoIdCliente, 
            clientName : data.nombreCliente,
            fantasyName : data.nombreFantasia,
            streetName : data.direccion,
            streetNumber : data.numeroDireccion,
            stateName : data.provincia,
            cpNumber : data.codigoPosta,
            cuitNumber : data.cuit,
            ivaType : 1,
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

        return crearCliente;
    }
}
export default Clients