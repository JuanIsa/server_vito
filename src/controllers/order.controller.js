import Orders from '../dao/handleOrders.js';
import { handleResponse } from './answer.controller.js';

const instanceOfOrders = new Orders();

export const createOrder = async (req, res) => {
    handleResponse(instanceOfOrders.createOrder(req.body), res);
};

export const getOrder = async (req, res) => {
    handleResponse(instanceOfOrders.getOrder(req.body), res);
};

export const getOrders = async (req, res) => {
    handleResponse(instanceOfOrders.getOrders(req.body), res);
};

export default {
    createOrder,
    getOrder,
    getOrders
}