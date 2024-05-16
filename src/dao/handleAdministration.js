import ivaTypesModel from "./models/modelIvaType.js";
import statesModel from "./models/modelState.js";

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

export default {
    tipoIvaSegunNombre,
    obtenerTiposIva,
    obtenerListaProvincias
}