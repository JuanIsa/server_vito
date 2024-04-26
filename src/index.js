"Use strict";
//Librerias externas o kernel
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

//Servicios
import mongoConnect from './services/mongoConnection.js';


//mongoConnect();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8900;

//Implementa la política de cors para que el servidor sea accesible desde cualquer punto de la web siempre y cuando los permisos estén correctamante asignados
app.use(cors());

app.use(express.json());
//Me permite visualizar todos los datos recibidos por el método post.
app.use(express.urlencoded({ extended: true }));
//Defino que los archivos estáticos los va a tomar del siguiente directorio:
app.use(express.static('public'));

app.post("/users", async (req, res) => {
    console.log("Se ejecutó una consulta POST");
    console.log(req.body);
    res.send({dataServer:"Te mando el ok desde el servidor"});
});
app.get("/", async (req, res) => {
    res.send("Todo Ok funcionando");
});

//ESCUCHA DEL SERVER
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}.`);
});

