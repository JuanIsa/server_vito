import mongoose from 'mongoose';
const mongoConnect = () => {
    mongoose.set('strictQuery', false);
// Conexión a base la de datos
//'mongodb+srv://usuario:contraseña@nombre-cluster.mongodb.net/nombre-base-de-datos?retryWrites=true&w=majority&appName=JTS";
    mongoose.connect(`mongodb+srv://${process.env.PASS_DB}@jts.kmpovyc.mongodb.net/${process.env.NAME_DB}?retryWrites=true&w=majority&appName=JTS`)
        .then(() => console.log('Conectado a la base de datos.'))
        .catch(e => console.log(e));
}
export default mongoConnect;
