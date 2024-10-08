import ivaTypesModel from "./models/modelIvaType.js";
import statesModel from "./models/modelState.js";
import articlePricesModel from "./models/modelArticlePrices.js";
import banksModel from "./models/modelBanks.js";
import retentionTypesModel from "./models/modelRetentionTypes.js";
import DataBase from "./handleDataBase.js"

const dataBase = new DataBase();

async function tipoIvaSegunNombre (nombreTipoIva) {
    const ivaList = await ivaTypesModel.findOne({typeName: nombreTipoIva});

    return ivaList.id;
}

async function obtenerTiposIva () {
    return await ivaTypesModel.find().sort({typeName: 1});
}

async function obtenerListaProvincias() {
    return await statesModel.find().sort({stateName : 1});
}

async function obtenerListaBancos() {
    return await banksModel.find().sort({nombre : 1});
}

async function obtenerListaRetenciones() {
    return await retentionTypesModel.find().sort({nombre : 1});
}

async function obtenerPrecioActualizadoArticulo(idArticulo, idLista) {
    if(idLista == 0) {
        idLista = await dataBase.findLastId(articlePricesModel);
    }

    const precioArticulo = await articlePricesModel.findOne(
        { id : idLista, "articulos.idArticulo": idArticulo }, 
        { articulos: { $elemMatch: { idArticulo: idArticulo } } }
    ).sort({ id: -1 });

    if(precioArticulo) {
        return precioArticulo.articulos[0].precio
    } else {
        return 0;
    }
}

async function obtenerUltimoAumentoArticulo(idArticulo, idLista) {
    if(idLista == 0) {
        idLista = await dataBase.findLastId(articlePricesModel);
    }

    const aumentoArticulo = await articlePricesModel.findOne(
        { id : idLista, "articulos.idArticulo": idArticulo }, 
        { articulos: { $elemMatch: { idArticulo: idArticulo } } }
    ).sort({ id: -1 });

    if(aumentoArticulo) {
        return aumentoArticulo.articulos[0].porcentajeAumento
    } else {
        return 0;
    }
}

export default {
    tipoIvaSegunNombre,
    obtenerTiposIva,
    obtenerListaProvincias,
    obtenerPrecioActualizadoArticulo,
    obtenerUltimoAumentoArticulo,
    obtenerListaBancos,
    obtenerListaRetenciones
}