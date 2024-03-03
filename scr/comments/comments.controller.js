import Publication from '../publications/publication.model.js';
import Comment from './comment.model.js';

export const createComment = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const { text } = req.body;

    try {
        const comment = new Comment({
            text,
            user: user._id,
        });

        await comment.save();

        const publication = await Publication.findById(id);
        if (!publication) {
            console.log('Publication not found');
        }

        console.log(publication.text);

        publication.comments.push(comment._id);
        await publication.save();

        res.status(200).json({
            msg: 'Successful comment.',
            publication: {
                ...publication.toObject(),
                comments: comment.text,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Could not comment' });
    }
};

export const getUserComments = async (req, res) => {
    try {
        const { _id, username } = req.user;
        const query = { user: _id, state: true };

        const comments = await Comment.find(query).populate('user', 'username');
        res.status(200).json({
            msg: `${username}'s comments`,
            comments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Can't get user's comments" });
    }
};

export const updateComment = async (req, res) => {
    const { _id, username } = req.user;
    const { id } = req.params;
    const { ...resto } = req.body;

    try {
        const comment = await Comment.findById(id);

        const idUser = _id.toString();
        const idUserC = comment.user._id.toString();

        if (idUser !== idUserC) {
            return res.status(403).json({ msg: 'This action is not authorized.' });
        }

        const updatedComment = await Comment.findByIdAndUpdate(id, resto, { new: true });

        res.status(200).json({
            msg: `Successfully updated by ${username}`,
            comment: updatedComment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Could not update comment' });
    }
};

export const deleteComment = async (req, res) => {
    const { _id, username } = req.user;
    const { id } = req.params;

    try {
        const comment = await Comment.findOneAndUpdate(
            { _id: id, user: _id },
            { state: false },
            { new: true }
        );

        if (!comment) {
            return res.status(404).json({ msg: 'This action is not authorized.' });
        }

        res.status(200).json({
            msg: `Successfully deleted by ${username}.`,
            comment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Could not delete comment' });
    }
};
