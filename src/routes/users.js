import { Router } from 'express';
import Users from '../dao/handlerUser.js';
import cookieParser from 'cookie-parser';
const usersRoute = Router();
usersRoute.use(cookieParser());

const instanceOfUsers = new Users();
//Variable global de este módulo que permite manejar los mensajes que se van a enviar al front desde el server.
//ruta_a_exportar.método(URL, middelware, callback(req,res))
usersRoute.post('/register',(req, res)=>{
    let respuesta = {
        error: false,
        message: "Se creó el usuario correctamente"
    }
    instanceOfUsers.createUser(req.body)
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
usersRoute.post('/login', (req, res)=>{});
usersRoute.get('/showusers', (req, res)=>{
        let respuesta = {
            error: false,
            message: "",
            data: []
        }
    instanceOfUsers.showUsers()
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
usersRoute.get('/showlisttypeusers', (req, res)=>{
    let respuesta = {
        error: false,
        message: "",
        data: []
    }
    instanceOfUsers.showListTypeUsers()
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
usersRoute.patch('/userstate', (req, res)=>{
    let respuesta = {
        error: false,
        message: "",
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


export default usersRoute;