import Clients from '../dao/handleClient.js';
import { handleResponse } from './answer.controller.js';

const instanceOfClients = new Clients();

const clientCreateClient = async (req, res) => {
    handleResponse(instanceOfClients.createClient(req.body), res);
};

export default {
    clientCreateClient
}