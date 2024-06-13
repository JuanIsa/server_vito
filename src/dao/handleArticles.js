import articleModel from './models/modelArticles.js';
import articlePricesModel from './models/modelArticlePrices.js';
import FuncionesComunes from './handleCommonFunctions.js';
import Administracion from './handleAdministration.js';
import DataBase from './handleDataBase.js';

const dataBase = new DataBase();

class Articles {
    async createArticle(data) {
        const articuloExistente = await articleModel.findOne({ nombre : data.nombreArticulo });

        if(articuloExistente && (data.idArticulo == 0 || data.idArticulo != articuloExistente.id)) {
            throw new Error('Ya existe un artículo con este nombre.');
        }

        if(data.idArticulo == 0) {
            let ultimoIdArticulo = await dataBase.findLastId(articleModel) + 1;

            return await articleModel.create({
                active: true,
                id: ultimoIdArticulo, 
                nombre: data.nombreArticulo,
                nombreAnterior: data.nombreAnterior,
                descripcion: data.descripcion,
                tipoArticulo: data.tipoArticulo,
                medidas: {
                    ancho: data.ancho,
                    alto: data.alto,
                    profundidad: data.profundidad
                },
                creationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                modificationData: {date:"",responsible:""},
                deleteData: {date:"",responsible:""}
            })
            //Deuelvo los datos de la creación o del error al front
            .then(data => data)
            .catch(e => e)
        } else {
            return await articleModel.findOneAndUpdate(
                {id: data.idArticulo},
                {
                    active: true,
                    nombre: data.nombreArticulo,
                    nombreAnterior: data.nombreAnterior,
                    descripcion: data.descripcion,
                    tipoArticulo: data.tipoArticulo,
                    medidas: {
                        ancho: data.ancho,
                        alto: data.alto,
                        profundidad: data.profundidad
                    },
                    modificationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                },
                {new: true}
            )
            .then(data => data)
            .catch(e => e)
        }
    }

    async createAccesory(data) {
        const articuloExistente = await articleModel.findOne({ nombre : data.nombreArticulo });

        if(articuloExistente && (data.idArticulo == 0 || data.idArticulo != articuloExistente.id)) {
            throw new Error('Ya existe un accesorio con este nombre.');
        }

        if(data.idArticulo == 0) {
            let ultimoIdArticulo = await dataBase.findLastId(articleModel) + 1;

            return await articleModel.create({
                active: true,
                id: ultimoIdArticulo, 
                nombre: data.nombreArticulo,
                descripcion: data.descripcion,
                tipoArticulo: data.tipoArticulo,
                relacionesArticulos: data.relacionesArticulos,
                creationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                modificationData: {date:"",responsible:""},
                deleteData: {date:"",responsible:""}
            })
            //Deuelvo los datos de la creación o del error al front
            .then(data => data)
            .catch(e => e)
        } else {
            return await articleModel.findOneAndUpdate(
                {id: data.idArticulo},
                {
                    active: true,
                    nombre: data.nombreArticulo,
                    descripcion: data.descripcion,
                    tipoArticulo: data.tipoArticulo,
                    relacionesArticulos: data.relacionesArticulos,
                    modificationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                },
                {new: true}
            )
            .then(data => data)
            .catch(e => e)
        }
    }

    async createService(data) {
        const articuloExistente = await articleModel.findOne({ nombre : data.nombreArticulo });

        if(articuloExistente && (data.idArticulo == 0 || data.idArticulo != articuloExistente.id)) {
            throw new Error('Ya existe un servicio con este nombre.');
        }

        if(data.idArticulo == 0) {
            let ultimoIdArticulo = await dataBase.findLastId(articleModel) + 1;

            return await articleModel.create({
                active: true,
                id: ultimoIdArticulo, 
                nombre: data.nombreArticulo,
                descripcion: data.descripcion,
                tipoArticulo: data.tipoArticulo,
                creationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                modificationData: {date:"",responsible:""},
                deleteData: {date:"",responsible:""}
            })
            //Deuelvo los datos de la creación o del error al front
            .then(data => data)
            .catch(e => e)
        } else {
            return await articleModel.findOneAndUpdate(
                {id: data.idArticulo},
                {
                    active: true,
                    nombre: data.nombreArticulo,
                    descripcion: data.descripcion,
                    tipoArticulo: data.tipoArticulo,
                    modificationData: {
                        date: FuncionesComunes.getDate(),
                        responsible: "root"
                    },
                },
                {new: true}
            )
            .then(data)
            .catch(e => e)
        }
    }

    async getArticle(params) {
        return await articleModel.findOne({id : params.idArticulo})
    }

    async getArticleId(nombre) {
        return await articleModel.findOne({nombre : nombre})
    }

    async changeStatusArticule(data){
        return await articleModel.findOneAndUpdate({id: data.idArticulo}, {active: data.estado}, { new: true })
        .then(data => data)
        .catch(e => e)
    }

    async listArticle() {
        return await articleModel.find().sort({nombre : 1})
        .then(data => data)
        .catch(e => e)
    }

    async listArticleWithPrices(data) {
        let idLista = 0;

        if(data.id) {
            idLista = data.id;
        }

        return await articleModel.find().sort({nombre : 1})
        .then(async data => {
            let respuesta = await Promise.all(data.map(async articulo => {
                const precioArticulo = await Administracion.obtenerPrecioActualizadoArticulo(articulo.id, idLista);

                console.log(precioArticulo);

                return {
                    id: articulo.id,
                    nombre: articulo.nombre,
                    descripcion: articulo.descripcion,
                    precio: precioArticulo,
                    tipoArticulo: articulo.tipoArticulo
                };
            }));

            return respuesta;
        })
        .catch(e => e)
    }

    async updateArticlePricesList(data) {
        if(data.idLista == 0) {
            let ultimoIdLista = await dataBase.findLastId(articlePricesModel) + 1;

            return await articlePricesModel.create({
                active: true,
                id: ultimoIdLista, 
                observaciones: data.observaciones,
                porcentaje: data.porcentajeAumento,
                articulos: data.articulos,
                fecha: new Date(),
                creationData: {
                    date: FuncionesComunes.getDate(),
                    responsible:"root"
                },
                modificationData: {
                    date: "",
                    responsible: ""
                },
                deleteData: {
                    date: "",
                    responsible: ""
                }
            })
            //Deuelvo los datos de la creación o del error al front
            .then(data => data)
            .catch(e => e)
        } else {
            return await articlePricesModel.findOneAndUpdate(
                {id: data.idLista},
                {
                    active: true,
                    observaciones: data.observaciones,
                    porcentaje: data.porcentajeAumento,
                    articulos: data.articulos,
                    modificationData: {
                        date: FuncionesComunes.getDate(),
                        responsible: "root"
                    },
                },
                {new: true}
            )
            .then(data)
            .catch(e => e)
        }
    }

    async getArticlePriceList(data) {
        return await articlePricesModel.findOne({id : data.id})
    }
}
export default Articles;