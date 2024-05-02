import userModel from './models/modelUsers.js';
import { createHash } from '../services/bcrypt.js';
import jwt from 'jsonwebtoken';

function getDate(){
    const now = new Date();
    const dia = now.getDate().toString().padStart(2, '0');
    const mes = (now.getMonth() + 1).toString().padStart(2, '0'); 
    const año = now.getFullYear();
    const hora = now.getHours().toString().padStart(2, '0');
    const minutos = now.getMinutes().toString().padStart(2, '0');
    const segundos = now.getSeconds().toString().padStart(2, '0');
    const fechaHoraTexto = `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`;
    JSON.stringify(now);
    return fechaHoraTexto;
}
class Users {
    async createUser(dataUser) {
        //Descompongo los datos de entrada.
        const {userName, password, role} = dataUser;
        const usuarioExistente = await userModel.findOne({ userName });
        if (usuarioExistente) {
            console.log("Entro al error");
            throw new Error('Ya existe un usuario con este nombre.');
        }
        const hashedPass = await createHash(password);
        //Verifico cuál es el último ID de ID de usuario y le sumo para que sea autoincremental
        let lastIdUser= await this.findTheLastOne()+1;
        //Creo un usuario en la colecicción
        const createUser = await userModel.create({
            active: true,
            idUser: lastIdUser, 
            role,
            userName,
            password: hashedPass,
            creationData: {date:getDate(),responsible:"root"},
            modificationData: {date:"",responsible:""},
            deleteData: {date:"",responsible:""}
        })
        //Deuelvo los datos de la creación o del error al front
        .then(data => data)
        .catch(e => e)
        return createUser;
    }
    //Función para buscar el último ID de los registros de los usuarios
    async findTheLastOne() {
        try {
            //busco el último registro
            const lastElement = await userModel.findOne().sort({ _id: -1 });
            if (lastElement) {
                //devuelvo el último id
                return lastElement.idUser;
            } else {
                //Si la colección está vacia inicio el ID en cero
                return 0;
            }
        } catch (error) {
            return error;
        }
    }
    async userLogin (dataUser) {
        //Genero un token único con los datos que me devuelve la base de datos para enviarlo como cookie encriptada
        //Utilizo el request de la petición a la base de datos para modificar los datos que se van a enviar al front y quitar datos sensibles
        //para eso utilizo el DTO, es una especie de filtro que me sirve para modificar datos sensibles que se van a enviar al front.
        const userToken =userDto.getTokenDTO(dataUser.body);
        //Con JSON Web Token genero un toquen único que tenga una fecha de expiración de 1 día.
        const token = jwt.sign(userToken, "Sharvelion", { expiresIn: '1d' });   
        //res.cookie(Nombre o denominación de la cookie (tiene que ser lo más corto posible), lo que se va a almacenar de la cookie)
        res.cookie("JTS",token).send({ status: 0, message: 'Sesión iniciada con éxito.' });
    }
    async showUsers(){
        const allUsers = await userModel.find()
            .then(data => data)
            .catch(e => e)
        return allUsers
    }
}
export default Users;