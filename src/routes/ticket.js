import { Router } from 'express'; 
import TicketsController from '../controllers/ticket.controller.js';

const ticketsRoute = Router();

ticketsRoute.post('/getlastcae', TicketsController.getLastCAE);
ticketsRoute.post('/generate', TicketsController.generateTicket);

export default ticketsRoute;