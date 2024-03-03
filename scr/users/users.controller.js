import bcryptjs from 'bcryptjs';
import User from './users.model.js';
import { request, response } from 'express';

export const userGet = async (req = request, res = response)=>{
    const {limite, desde} = req.query;
    const query = {estado: true};


    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        users
    });
}


export const getUserbyId = async(req, res) =>{
    const {id} = req.params;
    const user = await User.findOne({_id: id});

    res.status(200).json({
        user
    });
}

export const userPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, oldPassword, newPassword, google, email, ...resto } = req.body;

    const user = await User.findById(id);

    // Verifica si se proporciona oldPassword para la comparación
    if (oldPassword) {
        const validPassword = bcryptjs.compareSync(oldPassword, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: "Old password incorrect, password wasn't updated"
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                msg: "These passwords are the same, please change the new password"
            });
        }
    }

    if (newPassword) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(newPassword, salt);
    }

    await User.findByIdAndUpdate(id, resto);

    const userUpdated = await User.findOne({ _id: id });

    res.status(200).json({
        msg: 'Updated User',
        userUpdated
    });
};




export const usersPost = async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        user
    });
};
