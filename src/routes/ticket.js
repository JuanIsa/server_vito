import { Router } from 'express'; 
import TicketsController from '../controllers/ticket.controller.js';

const ticketsRoute = Router();

ticketsRoute.post('/getlastcae', TicketsController.getLastCAE);
ticketsRoute.post('/generate', TicketsController.generateTicket);
ticketsRoute.post('/gettickets', TicketsController.getTickets);
ticketsRoute.post('/getunpaidtickets', TicketsController.getUnpaidTickets);

export default ticketsRoute;