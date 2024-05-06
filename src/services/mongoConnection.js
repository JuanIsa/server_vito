import mongoose from 'mongoose';
const mongoConnect = () => {
    mongoose.set('strictQuery', false);
// Conexión a base la de datos
//'mongodb+srv://usuario:contraseña@nombre-cluster.mongodb.net/nombre-base-de-datos?retryWrites=true&w=majority&appName=JTS";
    mongoose.connect(`mongodb+srv://Sharvelion:nauj7895214@jts.kmpovyc.mongodb.net/PRUEBA-CAJAS?retryWrites=true&w=majority&appName=JTS`)
        .then(() => console.log('Conectado a la base de datos.'))
        .catch(e => console.log(e));
}
export default mongoConnect;
