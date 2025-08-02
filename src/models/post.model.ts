import mongoose, { Document, Model, ObjectId } from 'mongoose';

export interface IReply {
    user: string | ObjectId;
    comment: string;
    editedAt: Date;
    createdAt: Date;
}
export interface IComment {
    user: string | ObjectId;
    comment: string;
    editedAt: Date;
    createdAt: Date;
    replies: IReply[];
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

export const Post: Model<PostDocument> = mongoose.model<PostDocument>(
    'Post',
    postSchema
);
