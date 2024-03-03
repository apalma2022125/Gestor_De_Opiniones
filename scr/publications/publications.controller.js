import { response } from 'express';
import Publication from './publications.model.js';
import jwt from 'jsonwebtoken';


export const publicationsPost = async (req, res) => {
    const token = req.header('x-token');

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { title, category, text } = req.body;

    const publication = new Publication({ title, category, text, id: uid });

    await publication.save();

    res.status(202).json({
        publication
    });
}



export const publicationsGet = async (req, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const publications = await Publication.find(query)
            .select('-__v -estado')
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({
                path: 'id',
                select: 'email'
            })
            .populate({
                path: 'comments',
                match: { estado: true },
                populate: {
                    path: 'id',
                    select: 'email'
                }
            });

        const publicationsWithComments = publications.map(publication => {
            const comments = publication.comments.map(comment => ({
                idUser: comment.id ? comment.id.name : "User not found",
                commentText: comment.commentText
            }));

            return {
                ...publication.toObject(),
                id: publication.id ? publication.id.email : "User not found",
                comments
            };
        });

        const total = await Publication.countDocuments(query);

        res.status(200).json({
            total,
            publications: publicationsWithComments,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const publicationPut = async (req, res = response) => {
    const { _id: _idUser, username } = req.user;
    const { id } = req.params;
    const { ...resto } = req.body;

    try {
        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({ error: `Publication not found` });
        }

        if (!publication.estado) {
            return res.status(404).json({ error: `Publication has been deleted` });
        }

        const idUser = _idUser.toString();
        const idUserP = publication.id.toString();
        if (idUser !== idUserP) {
            return res.status(403).json({ msg: 'This action is not authorized.' });
        }

        const updatedPublication = await Publication.findByIdAndUpdate(id, resto, { new: true });

        if (!updatedPublication) {
            return res.status(404).json({ error: `Publication not found after update` });
        }

        res.status(200).json({
            msg: `Successfully updated `,
            publication: updatedPublication,
        });
    } catch (error) {
        console.error('Error updating publication:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const publicationDelete = async (req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { id } = req.params;

    try {
        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({ msg: "Publication not found, please try with another publication" });
        }

        if (uid == publication.id) {
            await Publication.findByIdAndUpdate(id, { estado: false });
        } else {
            return res.status(403).json({
                msg: "You can't DELETE this publication because you didn't create this PUBLICATION",
            });
        }

        res.status(200).json({
            msg: 'This publication was DELETED',
        });
    } catch (error) {
        console.error('Error deleting publication:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



