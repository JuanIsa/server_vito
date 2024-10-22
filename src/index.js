"Use strict";
//Librerias externas o kernel
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

//Servicios
import mongoConnect from './services/mongoConnection.js';
import usersRoute from './routes/users.js';
import articleRoute from './routes/articles.js';
import clientsRoute from './routes/client.js';
import ordersRoute from './routes/orders.js';
import ticketsRoute from './routes/ticket.js';
import administrationRoute from './routes/administration.js';

mongoConnect();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8900;

//Implementa la política de cors para que el servidor sea accesible desde cualquer punto de la web siempre y cuando los permisos estén correctamante asignados
app.use(cors());
//Middleware para la correcta interpretación de intercambios JSON.
app.use(express.json());
//Me permite visualizar todos los datos recibidos por el método post, básicamente todo lo que se codifique en las peticiones de verbos de trasnporte HTTP.
app.use(express.urlencoded({ extended: true }));
//Defino que los archivos estáticos los va a tomar del siguiente directorio: public.
app.use(express.static('public'));
//Rutas
app.use('/api/users', usersRoute);
app.use('/api/client', clientsRoute);
app.use('/api/article', articleRoute);
app.use('/api/order', ordersRoute);
app.use('/api/ticket', ticketsRoute);
app.use('/api/administration', administrationRoute);
//Ruta default de inicio del servidor.
app.get("/", async (req, res) => {
  res.send("Todo Ok funcionando");
});
// Middleware para manejar errores 404.
app.use((req, res, next) => {
    const err = new Error('URL no encontrada.');
    err.status = 404;
    next(err);
  });
// Middleware para manejar errores
app.use((err, req, res, next) => {
  // Si el error es 404, mostrar el GIF animado.
  if (err.status === 404) {
    res.status(404).sendFile(join(__dirname, 'public', 'error.gif'));
  } else {
    // Para otros errores, responder con un mensaje genérico
    res.status(err.status || 500).send('Error');
  }
});

//ESCUCHA DEL SERVER
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}.`);
});

