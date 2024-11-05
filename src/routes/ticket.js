import { Router } from 'express'; 
import TicketsController from '../controllers/ticket.controller.js';

const ticketsRoute = Router();

ticketsRoute.post('/getlastcae', TicketsController.getLastCAE);
ticketsRoute.post('/generate', TicketsController.generateTicket);
ticketsRoute.post('/generatecreditnote', TicketsController.generateCreditNote);
ticketsRoute.post('/generatedebitnote', TicketsController.generateDebitNote);
ticketsRoute.post('/gettickets', TicketsController.getTickets);
ticketsRoute.post('/getcreditnotes', TicketsController.getCreditNotes);
ticketsRoute.post('/getunpaidtickets', TicketsController.getUnpaidTickets);
ticketsRoute.post('/generatepayment', TicketsController.createPayment);
ticketsRoute.post('/getpayments', TicketsController.getPayments);
ticketsRoute.get('/printticket', TicketsController.printTicket);

export default ticketsRoute;