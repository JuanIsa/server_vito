import { Router } from 'express'; 
import ClientController from '../controllers/client.controller.js';

const clientsRoute = Router();

clientsRoute.post('/create', ClientController.clientCreateClient);

export default clientsRoute;