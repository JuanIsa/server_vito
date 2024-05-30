import articleModel from './models/modelArticles.js';
import FuncionesComunes from './handleCommonFunctions.js';
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

    async getAccesoriesArticles(data) {
        return null;
    }
}
export default Articles;