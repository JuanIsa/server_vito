import { Router } from 'express'; 
import ClientController from '../controllers/client.controller.js';

const clientsRoute = Router();

clientsRoute.get('/ivatypes', ClientController.clientIvaTypes);
clientsRoute.get('/statelist', ClientController.clientStateList);
clientsRoute.get('/facturar', ClientController.clientCreateTicket);
clientsRoute.get('/clientlist', ClientController.clientClientList);
clientsRoute.post('/create', ClientController.clientCreateClient);
clientsRoute.post('/getclient', ClientController.clientGetClient);
clientsRoute.post('/changestatus', ClientController.clientChangeStatus);

export default clientsRoute;