import Clients from '../dao/handlerClient.js';
import { handleResponse } from './answer.controller.js';

const instanceOfClients = new Clients();

export const clientCreateClient = async (req, res) => {
    handleResponse(instanceOfClients.createClient(req.body), res);
};

