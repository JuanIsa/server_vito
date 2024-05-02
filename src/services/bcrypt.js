import bcrypt from 'bcrypt';
//Función que cifra la contraseña
export const createHash = async (password) => {

    const salts = await bcrypt.genSalt(1);
    return bcrypt.hash(password, salts);
}

export const validatePassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);
