export const handleResponse = async (promise, res) => {
    let respuesta = {
        error: false,
        message: "Realizado correctamente",
        data: []
    };
    
    try {
        const data = await promise;
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