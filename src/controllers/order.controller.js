import Orders from '../dao/handleOrders.js';
import { handleResponse } from './answer.controller.js';

const instanceOfOrders = new Orders();

export const createOrder = async (req, res) => {
    handleResponse(instanceOfOrders.createOrder(req.body), res);
};

export default {
    createOrder
}