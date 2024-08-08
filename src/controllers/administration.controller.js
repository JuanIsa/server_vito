import Administration from '../dao/handleAdministration.js';
import { handleResponse } from './answer.controller.js';

export const getBankList = async (req, res) => {
    handleResponse(Administration.obtenerListaBancos(req.body), res);
};

export const getRetentionTypesList = async (req, res) => {
    handleResponse(Administration.obtenerListaRetenciones(req.body), res);
};

export default {
    getBankList,
    getRetentionTypesList
}