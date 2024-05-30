import orderModel from './models/modelOrders.js';
import FuncionesComunes from './handleCommonFunctions.js';
import DataBase from './handleDataBase.js';
import Clients from './handleClient.js';

const dataBase = new DataBase();

class Orders {
    async createOrder(data) {
        console.log(data);

        if(data.idPedido == 0) {
            let ultimoIdPedido = await dataBase.findLastId(orderModel) + 1;
            let datosCliente = await Clients.getClientId(data.cliente);


            return await orderModel.create({
                active: true,
                id: ultimoIdPedido, 
                idCliente: datosCliente.id,
                observaciones: data.observaciones,
                transporte: data.transporte,
                observacionesTransporte: data.observacionesTransporte,
                articulos: data.articulos,
                creationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                modificationData: {date:"",responsible:""},
                deleteData: {date:"",responsible:""}
            })
            //Deuelvo los datos de la creación o del error al front
            .then(data => data)
            .catch(e => e)
        }
    }
}
export default Orders;