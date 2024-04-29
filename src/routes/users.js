import { Router } from 'express';
import Users from '../dao/handlerUser.js';
const usersRoute = Router();

//ruta_a_exportar.método(URL, middelware, callbacck)

usersRoute.post('/register',(req, res)=>{
    const instanceOfUsers = new Users();
    instanceOfUsers.createUser(req.body)
        .then(data => {
            res.send(data);
        })
        .catch(e => e );
});
usersRoute.post('/login', (req, res)=>{});

export default usersRoute;