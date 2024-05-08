import Users from '../dao/handlerUser.js';

const instanceOfUsers = new Users();

const handleResponse = async (promise, res) => {
    let respuesta = {
        error: false,
        message: "",
        data: []
    };
    
    try {
        const data = await promise;
        //console.log(data);
        if (data.errors) {
            respuesta.error = true;
            respuesta.message = data.message;
        } else {
            respuesta.data = data;
        }
    } catch (e) {
        respuesta.error = true;
        respuesta.message = e.message;
    }
    res.send(respuesta);
};

export const userRegister = async (req, res) => {
    handleResponse(instanceOfUsers.createUser(req.body), res);
};

export const userShowUsers = async (req, res) => {
    handleResponse(instanceOfUsers.showUsers(), res);
};

export const showListTypeUsers = async (req, res)=>{
    handleResponse(instanceOfUsers.showListTypeUsers(), res);
}

