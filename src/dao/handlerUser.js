import userModel from './models/modelUsers.js';
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
    async createUser(user) {
        //Descompongo los datos de entrada del usuario
        const { role } = user;
        //Verifico cuál es el último ID de ID de usuario y le sumo para que sea autoincremental
        let lastIdUser= await this.findTheLastOne()+1;
        const createData = await userModel.create({
            idUser:lastIdUser, 
            role,
            creationDate:getDate()
        })
            .then(data => data)
            .catch(e => ({ Error: e }))
        return createData;
    }
    async findTheLastOne() {
        try {
            const lastElement = await userModel.findOne().sort({ _id: -1 });
            if (lastElement) {
                return lastElement.idUser;
            } else {
                return 0;
            }
        } catch (error) {
            return error;
        }
    }
}
export default Users;