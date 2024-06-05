import mongoose from 'mongoose';
const mongoConnect = () => {
    mongoose.set('strictQuery', false);
// Conexión a base la de datos
//'mongodb+srv://usuario:contraseña@nombre-cluster.mongodb.net/nombre-base-de-datos?retryWrites=true&w=majority&appName=JTS";
    mongoose.connect(`mongodb+srv://admin:faqzEmBvjh75JJI5@vitoehijos.55r21a6.mongodb.net/CAJAS?retryWrites=true&w=majority&appName=VitoEHijos`)
        .then(() => console.log('Conectado a la base de datos nueva.'))
        .catch(e => console.log(e));
}
export default mongoConnect;
