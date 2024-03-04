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



export const userPut = async (req = request, res = response) =>{
    const {id} = req.params; 
    const{_id, name, oldPassword, newPassword, email, google, ...resto} = req.body;
    const user = await User.findById(id);
    const validPasword = bcryptjs.compareSync(oldPassword, user.password);

    await User.findByIdAndUpdate(id, resto);

    const userUpdate = await User.findOne({_id: id});    

    res.status(200).json({
        msg: "This User has been update!!",
        userUpdate
    });


/*     return !validPasword
    ? res.status(400).json({ msg: "Incorrect old password, password not updated" })
    : oldPassword === newPassword
        ? res.status(400).json({ msg: "The new password must be different from the old one, please choose a new password" })
        : newPassword
            ? (() => {
                const salt = bcryptjs.genSaltSync();
                user.password = bcryptjs.hashSync(newPassword, salt);
            })()
            : null; */
}




export const usersPost = async (req, res) =>{
    const {name, email, password} = req.body;
    const user = new User({name, email, password});

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await User.save();

    res.status(200).json({
        user
    });
}