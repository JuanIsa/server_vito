import FuncionesComunes from './handleCommonFunctions.js'
import DataBase from './handleDataBase.js';
import Afip from '@afipsdk/afip.js';
import ConstantesAfip from '../assets/afipglobals.js';

const dataBase = new DataBase();

class Tickets {
    async getLastCAE() {
        const afip = new Afip({ CUIT: 20409378472 });
        const puntoDeVenta = 1;

        const ultimoIdCAE = await afip.ElectronicBilling.getLastVoucher(puntoDeVenta, ConstantesAfip.TiposComprobante.TIPO_FACTURA_A);

        let datosRespuesta = {
            ultimoIdCAE: ultimoIdCAE
        }

        return datosRespuesta;
    }

    async generateTicket(data) {
        console.log(data);
    }
}
export default Tickets;