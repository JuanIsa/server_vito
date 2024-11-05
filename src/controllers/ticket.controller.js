import { handleResponse } from './answer.controller.js';
import Tickets from '../dao/handleTickets.js';

const instanceOfTickets = new Tickets();

export const getLastCAE = async (req, res) => {
    handleResponse(instanceOfTickets.getLastCAE(req.body), res);
};

export const generateTicket = async (req, res) => {
    handleResponse(instanceOfTickets.generateTicket(req.body), res);
};

export const generateCreditNote = async (req, res) => {
    handleResponse(instanceOfTickets.generateCreditNote(req.body), res);
};

export const generateDebitNote = async (req, res) => {
    handleResponse(instanceOfTickets.generateDebitNote(req.body), res);
};

export const getTickets = async (req, res) => {
    handleResponse(instanceOfTickets.getTickets(req.body), res);
}

export const getCreditNotes = async (req, res) => {
    handleResponse(instanceOfTickets.getCreditNotes(req.body), res);
}

export const getUnpaidTickets = async (req, res) => {
    handleResponse(instanceOfTickets.getUnpaidTickets(req.body), res);
}

export const createPayment = async (req, res) => {
    handleResponse(instanceOfTickets.createPayment(req.body), res);
}

export const getPayments = async (req, res) => {
    handleResponse(instanceOfTickets.getPayments(req.body), res);
}

export const printTicket = async (req, res) => {
    handleResponse(instanceOfTickets.printTicket(req.body), res);
}

export default {
    getLastCAE,
    generateTicket,
    generateCreditNote,
    generateDebitNote,
    getTickets,
    getUnpaidTickets,
    createPayment,
    getPayments,
    printTicket,
    getCreditNotes
}