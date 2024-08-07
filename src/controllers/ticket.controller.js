import { handleResponse } from './answer.controller.js';
import Tickets from '../dao/handleTickets.js';

const instanceOfTickets = new Tickets();

export const getLastCAE = async (req, res) => {
    handleResponse(instanceOfTickets.getLastCAE(req.body), res);
};

export const generateTicket = async (req, res) => {
    handleResponse(instanceOfTickets.generateTicket(req.body), res);
};

export const getTickets = async (req, res) => {
    handleResponse(instanceOfTickets.getTickets(req.body), res);
}

export const getUnpaidTickets = async (req, res) => {
    handleResponse(instanceOfTickets.getUnpaidTickets(req.body), res);
}

export default {
    getLastCAE,
    generateTicket,
    getTickets,
    getUnpaidTickets
}