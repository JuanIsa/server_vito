import ivaTypesModel from "./models/modelIvaType.js";
import statesModel from "./models/modelState.js";
import articlePricesModel from "./models/modelArticlePrices.js";

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

async function obtenerPrecioActualizadoArticulo(idArticulo) {
    return await  articlePricesModel.findOne(
        { "articulos.idArticulo": idArticulo }, 
        { articulos: { $elemMatch: { idArticulo: idArticulo } }, id: 1 }
    ).sort({ id: -1 });
}

export default {
    tipoIvaSegunNombre,
    obtenerTiposIva,
    obtenerListaProvincias,
    obtenerPrecioActualizadoArticulo
}