import mongoose, { Document, Model, ObjectId } from 'mongoose';

export interface IReply {
    user: string | ObjectId;
    comment: string;
    editedAt: Date;
    createdAt: Date;
}
export interface IComment {
    _id?: string | ObjectId;
    user: string | ObjectId;
    comment: string;
    editedAt: Date;
    createdAt: Date;
    replies?: IReply[];
}
export interface IPost {
    title: string;
    content: string;
    image: string;
    author: string | ObjectId;
    comments: IComment[];
    editedAt: Date;
    createdAt: Date;
    likes: string[] | ObjectId[];
    publishedAt: Date;
    tags: string[];
    active: boolean;
}

export type ReplyDocument = IReply & Document;
export const replySchema = new mongoose.Schema<ReplyDocument>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    editedAt: Date,
    createdAt: Date
});

export type CommentDocument = IComment & Document;
export const commentSchema = new mongoose.Schema<CommentDocument>({
    comment: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    editedAt: Date,

    createdAt: Date,

    replies: {
        type: [replySchema],
        default: []
    }
});

export type PostDocument = IPost & Document;
export const postSchema = new mongoose.Schema<PostDocument>({
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    comments: {
        type: [commentSchema],
        default: []
    },

    likes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },

    editedAt: Date,

    createdAt: Date,

    publishedAt: Date,

    tags: {
        type: [String],
        default: []
    },
    active: {
        type: Boolean,
        default: true
    }
});

// Defining the index on the schema directly is the most robust solution.

// single field index
// postSchema.index({ title: 1 });

// compound field index
// postSchema.index({ title: 1, createdAt: 1 });

// embedded field index
// postSchema.index({ 'comments.createdAt': 1, createdAt: 1 });

// embedded document index
// postSchema.index({ 'comments': 1, createdAt: 1 });

export const Post: Model<PostDocument> = mongoose.model<PostDocument>(
    'Post',
    postSchema
);
