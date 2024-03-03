import User from '../users/users.model.js';
import Comment from '../comments/comments.model.js';
import Publication from '../publications/publications.model.js'

export const existingEmail = async (email = '') => {
    const existEmail = await User.findOne({ email });
    if (existEmail) {
        throw new Error(`This email: ${email} is really used`);
    }
}

export const existingUserById = async (id = '') => {
    const existUsuario = await User.findById(id);
    if (!existUsuario) {
        throw new Error(`A user with this iD: ${id} don't exists in database`);
    }
}
export const commentNoExists = async (id = '') => {
    const commentNoE = await Comment.findById(id);
    if (!commentNoE) {
        throw new Error(`Comment doesnt exists in the database`);
    }
    if (!commentNoE.state) {
        throw new Error(`Comment has been deleted`);
    }
}

export const PubliNoExists = async (id = '') => {
    const publiNoE = await Publication.findById(id);
    if (!publiNoE) {
        throw new Error(`Publication doesnt exists in the database`);
    }
    if (!publiNoE.state) {
        throw new Error(`Publication has been deleted`);
    }
}


