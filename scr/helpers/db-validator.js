import User from '../users/users.model.js';


export const existingEmail = async (email = '') => {
    const existEmail = await User.findOne({email});
    if (existEmail){
        throw new Error(`This email: ${email} is really used`);
    }
}

export const existingUserById = async (id = '') => {
    const existUsuario = await User.findById(id);
    if (!existUsuario){
        throw new Error(`A user with this iD: ${id} don't exists in database`);
    }
}

