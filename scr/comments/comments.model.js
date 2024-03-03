import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentText: {
        type: String,
        required: [true, 'The title is required']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

CommentSchema.methods.toJSON = function(){
    const {__v, _id, ...comment} = this.toObject();
    comment.commentId = _id;
    return comment;
}

export default mongoose.model('Comment', CommentSchema)