import { Router } from 'express'; 
import Clients from '../dao/handleClient.js';

const clientsRoute = Router();
const instanceOfClients = new Clients();

clientsRoute.post('/create', instanceOfClients.createClient);

export default clientsRoute;