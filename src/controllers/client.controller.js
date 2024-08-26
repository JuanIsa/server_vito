import Clients from '../dao/handleClient.js';
import { handleResponse } from './answer.controller.js';

const instanceOfClients = new Clients();

const clientCreateClient = async (req, res) => {
    handleResponse(instanceOfClients.createClient(req.body), res);
};

const clientIvaTypes = async (req, res) => {
    handleResponse(instanceOfClients.getIvaTypes(req.body), res);
};

const clientStateList = async (req, res) => {
    handleResponse(instanceOfClients.getStateList(req.body), res);
};

const clientGetClient = async (req, res) => {
    handleResponse(instanceOfClients.getClient(req.body), res);
};

const clientClientList = async (req, res) => {
    handleResponse(instanceOfClients.clientList(), res);
};

const clientChangeStatus = async (req, res) => {
    handleResponse(instanceOfClients.changeStatusClient(req.body), res);
};

const clientCreateTicket = async (req, res) => {
    handleResponse(instanceOfClients.clientCreateTicket(req.body), res);
};

const clientGetCurrentAccount = async (req, res) => {
    handleResponse(instanceOfClients.clientGetCurrentAccount(req.body), res);
};

export default {
    clientCreateClient,
    clientIvaTypes,
    clientStateList,
    clientGetClient,
    clientClientList,
    clientChangeStatus,
    clientCreateTicket,
    clientGetCurrentAccount
}