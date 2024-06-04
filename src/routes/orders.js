import { Router } from 'express'; 
import OrderController from '../controllers/order.controller.js';

const ordersRoute = Router();

ordersRoute.post('/createorder', OrderController.createOrder);
ordersRoute.post('/get', OrderController.getOrder);
ordersRoute.post('/getorders', OrderController.getOrders);

export default ordersRoute;