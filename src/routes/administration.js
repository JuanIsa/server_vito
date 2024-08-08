import { Router } from 'express'; 
import administrationController from '../controllers/administration.controller.js';

const administrationRoute = Router();

administrationRoute.get('/banklist', administrationController.getBankList);
administrationRoute.get('/retentionlist', administrationController.getRetentionTypesList);

export default administrationRoute;