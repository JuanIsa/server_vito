import orderModel from './models/modelOrders.js';
import FuncionesComunes from './handleCommonFunctions.js';
import DataBase from './handleDataBase.js';
import Clients from './handleClient.js';
import Articles from './handleArticles.js';

const dataBase = new DataBase();
const clients = new Clients();
const articles = new Articles();

class Orders {
    async createOrder(data) {
        let datosCliente = await clients.getClientId(data.idCliente);

        if(data.idPedido == 0) {
            let ultimoIdPedido = await dataBase.findLastId(orderModel) + 1;

            return await orderModel.create({
                active: true,
                id: ultimoIdPedido, 
                idCliente: datosCliente.id,
                observaciones: data.observaciones,
                transporte: data.transporte,
                observacionesTransporte: data.observacionesTransporte,
                fechaPedido: new Date(),
                fechaCumplido: null,
                fechaAnulado: null,
                estadoPedido: 'NO CONFIRMADO',
                articulos: data.articulos,
                creationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                modificationData: {date:"",responsible:""},
                deleteData: {date:"",responsible:""}
            })
            //Deuelvo los datos de la creación o del error al front
            .then(data => data)
            .catch(e => e)
        }

        return await orderModel.findOneAndUpdate(
            // Verificar el estado del pedido antes de editarlo

            {id: data.idPedido},
            {
                active: true,
                idCliente: datosCliente.id,
                observaciones: data.observaciones,
                transporte: data.transporte,
                observacionesTransporte: data.observacionesTransporte,
                articulos: data.articulos,
                modificationData: {date:FuncionesComunes.getDate(),responsible:"root"},
            },
            {new: true}
        )
        .then(data => data)
        .catch(e => e)
    }

    async getOrder(params) {
        return await orderModel.findOne({id : params.idPedido})
                        .then(data => data)
                        .catch(e => e)
    }

    async getOrders(params) {
        let filtros = {};

        console.log(params);

        // Filtrar por fechas si están presentes en los filtros
        if (params.fechaPedidoDesde) {
            filtros.fechaPedido = {
                $gte: new Date(params.fechaPedidoDesde),
                $lte: new Date(params.fechaPedidoHasta)
            };
        }

        if (params.estado) {
            filtros.estadoPedido = params.estado;
        }

        if (params.cliente) {
            let datosCliente = await clients.getClientId(params.cliente);
            filtros.idCliente = datosCliente.id;
        }
    
        if (params.articulo) {
            let datosArticulo = await articles.getArticleId(params.articulo);
            filtros.articulos =  { $elemMatch: { idArticulo : datosArticulo.id } };
        }
        
        return await orderModel.find(filtros)
            .then(data => data)
            .catch(e => e)
    }
}
export default Orders;