import userModel from './models/modelUsers.js';
import userModelList from './models/modelListTypeUsers.js';
import { createHash } from '../services/bcrypt.js';
import jwt from 'jsonwebtoken';
import FuncionesComunes from './handleCommonFunctions.js'
import DataBase from './handleDataBase.js';

const dataBase = new DataBase();

class Users {
    async createUser(dataUser) {
        //Descompongo los datos de entrada.
        let {idUser, userName, password, role} = dataUser;
        //Llevo todos los datos de entrada a minúscula.
        userName = userName.toLowerCase();
        //Hasheo (encripto) el password del usuario.
        const hashedPass = await createHash(password);
        if(idUser == 0) {
            //Reviso si ya existe el usuario en la base de datos.
            const usuarioExistente = await userModel.findOne({ userName });
            if (usuarioExistente) {
                throw new Error('Ya existe un usuario con este nombre.');
            }
            //Verifico cuál es el último ID de ID de usuario y le sumo para que sea autoincremental
            let lastIdUser= await dataBase.findLastId(userModel) + 1;
            //Creo un usuario en la colecicción
            const createUser = await userModel.create({
                active: true,
                id: lastIdUser, 
                role,
                userName,
                password: hashedPass,
                creationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                modificationData: {date:"",responsible:""},
                deleteData: {date:"",responsible:""}
            })
            //Deuelvo los datos de la creación o del error al front
            .then(data => data)
            .catch(e => e)

            return createUser;
        } 

        const updateUser = await userModel.findOneAndUpdate(
            {id: idUser},
            {
                role: role,
                userName: userName,
                password: hashedPass,
                modificationData: {date:FuncionesComunes.getDate(),responsible:"root"},
            },
            {new: true}
        )
        .then(data => data)
        .catch(e => e)
        
        return updateUser;
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
        //Devuelve la lista completa de usuarios ordenados alfabéticamente de manera decendente.
        const allUsers = await userModel.find().sort({userName:1})
            .then(data => data)
            .catch(e => e)
        return allUsers
    }
    async showOneUser(user){
        //Devuelve la lista completa de usuarios ordenados alfabéticamente de manera decendente.
        const allUsers = await userModel.find({id: user.idUser})
        .then(data => data)
        .catch(e => e)
        return allUsers
    }
    async showOneTypeUser(user){
        //Devuelve la lista completa de usuarios ordenados alfabéticamente de manera decendente.
        const allUsers = await userModelList.find({id: user.idType})
        .then(data => data)
        .catch(e => e)
        return allUsers
    }
    async showListTypeUsers(){
        const allUsers = await userModelList.find()
            .then(data => data)
            .catch(e => e)
        return allUsers
    }
    async userState(dataUser){
        const {idUser, active} = dataUser;
        // Actualizar el campo 'email' del usuario con el ID dado, el parámetro { new: true }
        //me dice que una vez hecha la modificación devuelva el documento con los cambios hechos.
        const allUsers = await userModel.findOneAndUpdate({id: idUser}, {active: active}, { new: true })
            .then(data => {
                return data;
            })
            .catch(e => {
                return e;
            })
        return allUsers
    }
    async createTypeUser(dataTypeUser) {
        //Descompongo los datos de entrada.
        let {idType, role} = dataTypeUser;
        //Llevo todos los datos de entrada a minúscula.
        role = role.toLowerCase();

        if(idType == 0) {
            //Reviso si ya existe el usuario en la base de datos.
            const rolExistente = await userModelList.findOne({ role });
            if (rolExistente) {
                throw new Error('Ya existe un usuario con este nombre.');
            }
            //Verifico cuál es el último ID de ID de usuario y le sumo para que sea autoincremental
            let lastIdRole = await dataBase.findLastId(userModelList) + 1;
            //Creo un usuario en la colecicción
            const createTypeUser = await userModelList.create({
                active: true,
                id: lastIdRole, 
                role,
                creationData: {date:FuncionesComunes.getDate(),responsible:"root"},
                modificationData: {date:"",responsible:""},
                deleteData: {date:"",responsible:""}
            })
            //Deuelvo los datos de la creación o del error al front
            .then(data => data)
            .catch(e => e)

            return createTypeUser;
        } 

        const updateTypeUser = await userModelList.findOneAndUpdate(
            {id: idType},
            {
                role: role,
                modificationData: {date:FuncionesComunes.getDate(),responsible:""},
            },
            {new: true}
        )
        .then(data => data)
        .catch(e => e)
        
        return updateTypeUser;
    }
    async userTypeState(dataTypeUser){
        const {idType, active} = dataTypeUser;
        // Actualizar el campo 'email' del usuario con el ID dado, el parámetro { new: true }
        //me dice que una vez hecha la modificación devuelva el documento con los cambios hechos.
        const allTypeUsers = await userModelList.findOneAndUpdate({id: idType}, {active: active}, { new: true })
            .then(data => {
                return data;
            })
            .catch(e => {
                return e;
            })
        return allTypeUsers
    }
}
export default Users;