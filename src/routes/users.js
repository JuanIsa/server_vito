import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { 
    userRegister, 
    userShowUsers, 
    showListTypeUsers, 
    userShowOneUser,
    userRegisterTypeUser,
    userShowOneTypeUser,
    userSwitchState,
    userSwitchStateTypeUser
} from '../controllers/user.controler.js';

//Variable global de este módulo que permite manejar los mensajes que se van a enviar al front desde el server.
const usersRoute = Router();
usersRoute.use(cookieParser());
//Variable_global_de_control.método(URL, middelware, callback(req,res)) o sinó sin el middleware de control como es este caso.
//Variable_global_de_control.método(URL, callback(req,res))
usersRoute.get('/showusers', userShowUsers);
usersRoute.get('/showlisttypeusers', showListTypeUsers);
usersRoute.post('/register', userRegister);
usersRoute.post('/showoneuser', userShowOneUser);
usersRoute.post('/registerTypeUser', userRegisterTypeUser);
usersRoute.post('/showonetypeuser', userShowOneTypeUser);
usersRoute.patch('/userState', userSwitchState);
usersRoute.patch('/usertypestate', userSwitchStateTypeUser);

usersRoute.post('/login', (req, res)=>{});

export default usersRoute;