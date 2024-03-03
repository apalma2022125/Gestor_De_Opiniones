import { request, response } from 'express';
import { Jwt } from 'jsonwebtoken';
import Publication from './publications.model'
import User from '../users/users.model'


export const publicationsGet = async (req, res = response) => {
    const query = {state: true};

    const publications = await Publication.find(query)
        .populate('user', 'username')
        .populate({
            path: 'comments',
            select: 'text'
    });
    const total = publications.length;

    res.status(200).json({
        total,
        publications
    });
}

export const publicationGetById = async  (req, res) =>{
    const {id} = req.params;
    const publication = await Publication.findOne({_id: id})
    .populate('user', 'username')
        .populate({
            path: 'comments',
            select: 'text'
    });

    res.status(200).json({
        publication
    });
}




export const coperexPut = async (req, res) =>{
    const {id} = req.params;
    const {_id, ...resto} = req.body;

    await Coperex.findByIdAndUpdate(id, resto);

    const coperex = await Coperex.findOne({_id: id});

    res.status(200).json({
        msg: 'Company updated',
        coperex
    });
}




export const updatePublication = async (req, res) => {
    try {
        const token = req.header('x-token');
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const { id } = req.params;
        const { _id, idUser, ...resto } = req.body;

        const publication = await Publication.findOne({ _id: id });

        if (!publication) {
            return res.status(404).json({ msg: "Publication not found, please try with another publication" });
        }

        if (uid === publication.idUser) {
            await Publication.findByIdAndUpdate(id, resto);
            const publicationUpdate = await Publication.findOne({ _id: id });

            return res.status(200).json({
                msg: 'This publication was edited',
                publicationUpdate
            });
        } else {
            return res.status(400).json({
                msg: "You can't edit this publication because you didn't create it",
            });
        }
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deletePublication = async (req, res) => {
    try {
        const token = req.header('x-token');
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const { id } = req.params;

        const publication = await Publication.findById({ _id: id });

        if (!publication) {
            return res.status(404).json({ msg: "Publication not found, please try with another publication" });
        }

        if (uid === publication.idUser) {
            await Publication.findByIdAndUpdate(id, { estado: false });
            return res.status(200).json({
                msg: 'This publication was deleted',
            });
        } else {
            return res.status(400).json({
                msg: "You can't delete this publication because you didn't create it",
            });
        }
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
};
