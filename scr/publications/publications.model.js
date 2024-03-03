import mongoose from 'mongoose';

const PublicationSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'The title is required']
    },
    category: {
        type: String,
        required: [true, 'The category is required']
    },
    text: {
        type: String,
        required: [true, 'The text is required']
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    estado: {
        type: Boolean,
        default: true,
        
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: []
    }]
});

PublicationSchema.methods.toJSON = function(){
    const {__v, _id, ...publication} = this.toObject();
    publication.publication_id = _id;
    return publication;
}

export default mongoose.model('Publication', PublicationSchema)