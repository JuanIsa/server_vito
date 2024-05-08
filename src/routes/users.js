import { Router } from 'express';
import Users from '../dao/handlerUser.js';
import cookieParser from 'cookie-parser';
import { userRegister, userShowUsers, showListTypeUsers } from '../controllers/user.controler.js';

const instanceOfUsers = new Users();
//Variable global de este módulo que permite manejar los mensajes que se van a enviar al front desde el server.
const usersRoute = Router();
usersRoute.use(cookieParser());
//Variable_global_de_control.método(URL, middelware, callback(req,res)) o sinó sin el middleware de control como es este caso.
//Variable_global_de_control.método(URL, callback(req,res))
usersRoute.get('/showusers', userShowUsers);
usersRoute.get('/showlisttypeusers', showListTypeUsers);
usersRoute.post('/register',userRegister);

usersRoute.post('/login', (req, res)=>{});
usersRoute.post('/showoneuser', (req, res)=>{
    let respuesta = {
        error: false,
        message: "",
        data: []
    }
    instanceOfUsers.showOneUser(req.body)
        .then(data=>{
            if (Array.isArray(data) && data.length === 0) {
                respuesta.error= true;
                respuesta.message= "No existe un usuario con ese ID";
            }else{
            respuesta.data = data;
            }
            res.send(respuesta);
        })
        .catch(e=>{
            respuesta.error= true;
            respuesta.message= e.message;
            res.send(respuesta);
        });
});
usersRoute.post('/registerTypeUser',(req, res)=>{
    let respuesta = {
        error: false,
        message: "Se creó el tipo de usuario correctamente"
    }
    instanceOfUsers.createTypeUser(req.body)
    .then(data => {
        if(data.errors) {
            respuesta.error= true;
            respuesta.message= data.message;
        }
        res.send(respuesta);
    })
    .catch(e => {
        respuesta.error= true;
        respuesta.message= e.message;
        res.send(respuesta);
    });
});
usersRoute.post('/showonetypeuser', (req, res)=>{
    let respuesta = {
        error: false,
        message: "",
        data: []
    }
    instanceOfUsers.showOneTypeUser(req.body)
        .then(data=>{
            if (Array.isArray(data) && data.length === 0) {
                respuesta.error= true;
                respuesta.message= "No existe un tipo de usuario con el id indicado";
            }else{
            respuesta.data = data;
            }
            res.send(respuesta);
        })
        .catch(e=>{
            respuesta.error= true;
            respuesta.message= e.message;
            res.send(respuesta);
        });
});
usersRoute.patch('/userstate', (req, res)=>{
    let respuesta = {
        error: false,
        message: "Realizado correctamente",
        data: []
    }
    instanceOfUsers.userState(req.body)
        .then(data=>{
            if(data.errors) {
                respuesta.error= true;
                respuesta.message= data.message;
            }else{
            respuesta.data = data;
            }
            res.send(respuesta);
        })
        .catch(e=>{
            respuesta.error= true;
            respuesta.message= e.message;
            res.send(respuesta);
        });
});

usersRoute.patch('/usertypestate', (req, res)=>{
    let respuesta = {
        error: false,
        message: "Realizado correctamente",
        data: []
    }
    instanceOfUsers.userTypeState(req.body)
        .then(data=>{
            if(data.errors) {
                respuesta.error= true;
                respuesta.message= data.message;
            }else{
            respuesta.data = data;
            }
            res.send(respuesta);
        })
        .catch(e=>{
            respuesta.error= true;
            respuesta.message= e.message;
            res.send(respuesta);
        });
});
export default usersRoute;