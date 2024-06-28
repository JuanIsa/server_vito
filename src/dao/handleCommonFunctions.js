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

function getDateAMD() {
    let hoy = new Date();    
    let año = hoy.getFullYear();
    let mes = hoy.getMonth() + 1;
    let dia = hoy.getDate();
    mes = mes < 10 ? '0' + mes : mes;
    dia = dia < 10 ? '0' + dia : dia;
    
    return `${año}${mes}${dia}`;
}

export default {
    getDate,
    getDateAMD
}