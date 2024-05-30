import { Router } from 'express'; 
import OrderController from '../controllers/order.controller.js';

const ordersRoute = Router();

ordersRoute.post('/createorder', OrderController.createOrder);

export default ordersRoute;