import Publication from '../publications/publications.model.js';
import Comment from './comments.model.js'; // Asegúrate de importar tu modelo de comentario
import jwt from 'jsonwebtoken';

export const commentPost = async (req, res) =>{
    const token = req.header('x-token');
    const { pul } = req.params;
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const {commentText} = req.body;

    const publication = await Publication.findById(pul);

    if (!publication) {
        return res.status(404).json({ 
            msg: 'Publication not found, plis try with other publication' 
        });
    }

    if (!publication.estado) {
        return res.status(400).json({ 
            msg: 'Cannot add comment because the publication was deleted' 
        });
    }
    
    const comment = new Comment({ id: uid, commentText});

    await comment.save();

    publication.comments.push(comment);

    await publication.save();

    res.status(202).json({
        msg: 'Content of the publication: ',
        Text: publication.text,
        comment
    });
}

export const commentsGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const comments = await Comment.find(query)
            .select('-__v -estado')
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({
                path: 'id',
                select: 'nombre correo',
            });

        const total = await Comment.countDocuments(query);

        const commentsWithEmail = comments.map((comment) => ({
            Id_Comment: comment._id,
            correo: comment.id ? comment.id.correo : 'User not found',
            commentText: comment.commentText,
            commentId: comment.commentId,
        }));

        res.status(200).json({
            total,
            commentsWithEmail,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const commentPut = async (req, res) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
    const { id } = req.params;
    const { _id, idUser, estado, ...resto } = req.body;

    try {
        const comment = await Comment.findOne({ _id: id });

        if (!comment) {
            return res.status(404).json({ msg: "Comment not found, please try with another comment" });
        }

        if (uid == comment.id) {
            await Comment.findByIdAndUpdate(id, resto);
        } else {
            return res.status(403).json({
                msg: "You can't EDIT this comment because you didn't create this COMMENT",
            });
        }

        const commentUpdate = await Comment.findOne({ _id: id });

        res.status(200).json({
            msg: 'This comment was EDITED',
            commentUpdate,
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const commentDelete = async (req, res) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
    const { id } = req.params;

    try {
        const comment = await Comment.findById({ _id: id });

        if (!comment) {
            return res.status(404).json({ msg: "Comment not found, please try with another comment" });
        }

        if (uid == comment.id) {
            await Comment.findByIdAndUpdate(id, { estado: false });
        } else {
            return res.status(403).json({
                msg: "You can't DELETE this comment because you didn't create this COMMENT",
            });
        }

        res.status(200).json({
            msg: 'This comment was DELETED',
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
