import { Router } from 'express'; 
import TicketsController from '../controllers/ticket.controller.js';

const ticketsRoute = Router();

ticketsRoute.post('/getlastcae', TicketsController.getLastCAE);
ticketsRoute.post('/generate', TicketsController.generateTicket);
ticketsRoute.post('/generatecreditnote', TicketsController.generateCreditNote);
ticketsRoute.post('/generatedebitnote', TicketsController.generateDebitNote);
ticketsRoute.post('/gettickets', TicketsController.getTickets);
ticketsRoute.post('/getunpaidtickets', TicketsController.getUnpaidTickets);
ticketsRoute.post('/generatepayment', TicketsController.createPayment);
ticketsRoute.post('/getpayments', TicketsController.getPayments);

export default ticketsRoute;