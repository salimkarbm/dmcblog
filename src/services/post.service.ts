import { NextFunction } from 'express';
import AppError from '../utils/errors/appError';
import STATUS_CODE from '../shared/constants';
import PostRepository from '../repositories/post.repository';
import { IComment, IPost } from '../models/post.model';
import {
    cloudinaryDestroy,
    cloudinaryUpload,
    extractPublicId,
    getFilePath
} from '../utils';
import ERROR_MESSAGE from '../shared/message/error';
import UserRepository from '../repositories/user.repository';
import { UserDocument } from '../models/user.model';
import RedisCache from './redis-cache.service';
import appConfig from '../config';

const postRepo = new PostRepository();
const userRepo = new UserRepository();
const redisCache = new RedisCache();

export default class PostService {
    public async createPost(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<IPost | void> {
        const filePath = getFilePath(req);
        if (filePath) {
            const cloudinary = await cloudinaryUpload(filePath as string);
            if (cloudinary) {
                req.body.image = cloudinary.url;
            }
            return next(
                new AppError(
                    'Cloudinary not found! unable to upload image',
                    STATUS_CODE.notFound()
                )
            );
        }
        req.body.author = req.user._id;
        const post = await postRepo.create(req.body);
        return post;
    }

    public async fetchPosts(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<any | void> {
        const { page, limit } = req.query;
        const cachedPosts = await redisCache.get('posts');
        if (!cachedPosts) {
            // eslint-disable-next-line no-unused-vars
            const posts = await postRepo.findWithPagination(
                { active: true },
                {
                    page: Number(page) || 1,
                    limit: Number(limit) || 10
                }
            );

            await redisCache.setWithExpiry(
                JSON.stringify(posts),
                'posts',
                appConfig.REDIS.TTL
            );

            return posts;
        }
        const post = JSON.parse(cachedPosts);
        return post;
    }

    public async findPost(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<IPost | void> {
        // Check if data exist in Redis or not
        const cachedUser = await redisCache.get('post', req.params.postId);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
        const post = await postRepo.findOne({ _id: req.params.postId });
        if (!post) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('post'),
                    STATUS_CODE.notFound()
                )
            );
        }

        await redisCache.set('post', req.params.postId, JSON.stringify(post));
        return post as IPost;
    }

    public async userPosts(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<any | void> {
        if (req.params.userId !== req.user._id.toString()) {
            return next(
                new AppError(
                    ERROR_MESSAGE.UNAUTHORIZED,
                    STATUS_CODE.unauthorized()
                )
            );
        }
        const user: UserDocument | null = await userRepo.findOne({
            _id: req.params.userId
        });
        if (!user) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('user'),
                    STATUS_CODE.notFound()
                )
            );
        }
        const posts = await postRepo.findWithPagination({
            author: req.params.userId,
            active: true
        });
        return posts;
    }

    public async updatePost(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<IPost | void> {
        const user: UserDocument | null = await userRepo.findOne({
            _id: req.user._id
        });
        if (!user) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('user'),
                    STATUS_CODE.notFound()
                )
            );
        }
        const filePath = getFilePath(req);
        if (filePath) {
            const cloudinary = await cloudinaryUpload(filePath as string);
            if (cloudinary) {
                req.body.image = cloudinary.url;
            }
            return next(
                new AppError(
                    'Cloudinary not found! unable to upload image',
                    STATUS_CODE.notFound()
                )
            );
        }

        const post = await postRepo.findOne({
            _id: req.params.postId,
            active: true
        });
        if (!post) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('post'),
                    STATUS_CODE.notFound()
                )
            );
        }
        const publicId = post.image ? extractPublicId(post.image) : null;
        if (publicId) {
            await cloudinaryDestroy(publicId);
        }
        const updatedPost = await postRepo.update(
            {
                _id: req.params.postId
            },
            {
                $set: {
                    title: req.body.title || post.title,
                    content: req.body.content || post.content,
                    image: req.body.image || post.image,
                    tags: req.body.tags || post.tags
                }
            }
        );
        return updatedPost as IPost;
    }

    public async removePost(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<any | void> {
        const user: UserDocument | null = await userRepo.findOne({
            _id: req.user._id
        });
        if (!user) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('user'),
                    STATUS_CODE.notFound()
                )
            );
        }
        const post = await postRepo.findOne({ _id: req.params.postId });
        if (!post) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('post'),
                    STATUS_CODE.notFound()
                )
            );
        }
        const publicId = post.image ? extractPublicId(post.image) : null;
        if (publicId) {
            await cloudinaryDestroy(publicId);
        }
        const posts = await postRepo.update(
            { _id: req.params.postId },
            { $set: { active: false } }
        );
        return posts;
    }

    public async postComment(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<IComment | void> {
        const user: UserDocument | null = await userRepo.findOne({
            _id: req.user._id
        });
        if (!user) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('user'),
                    STATUS_CODE.notFound()
                )
            );
        }
        const post = await postRepo.findOne({ _id: req.params.postId });
        if (!post) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('post'),
                    STATUS_CODE.notFound()
                )
            );
        }
        post.comments.push({ ...req.body, user: req.user._id });
        post.save();
        return post.comments[post.comments.length - 1];
    }

    public async fetchPostComments(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<IComment[] | void> {
        const post = await postRepo.findOne({ _id: req.params.postId });
        if (!post) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('post'),
                    STATUS_CODE.notFound()
                )
            );
        }
        return post.comments;
    }

    public async findPostComment(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<IComment | void> {
        const post = await postRepo.findOne({ _id: req.params.postId });
        if (!post) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('post'),
                    STATUS_CODE.notFound()
                )
            );
        }

        const commentExists = post.comments.find(
            (comment) => comment._id?.toString() === req.params.commentId
        );
        if (!commentExists) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('comment'),
                    STATUS_CODE.notFound()
                )
            );
        }
        return commentExists;
    }

    public async updatePostComment(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<IComment | void> {
        const user: UserDocument | null = await userRepo.findOne({
            _id: req.user._id
        });
        if (!user) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('user'),
                    STATUS_CODE.notFound()
                )
            );
        }
        const post = await postRepo.findOne({ _id: req.params.postId });
        if (!post) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('post'),
                    STATUS_CODE.notFound()
                )
            );
        }

        const commentExists = post.comments.find(
            (comment) => comment._id?.toString() === req.params.commentId
        );
        if (!commentExists) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('comment'),
                    STATUS_CODE.notFound()
                )
            );
        }

        commentExists.comment = req.body.comment;
        post.save();
        return commentExists;
    }

    public async removePostComment(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<IComment | void> {
        const user: UserDocument | null = await userRepo.findOne({
            _id: req.user._id
        });
        if (!user) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('user'),
                    STATUS_CODE.notFound()
                )
            );
        }
        const post = await postRepo.findOne({ _id: req.params.postId });
        if (!post) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('post'),
                    STATUS_CODE.notFound()
                )
            );
        }

        const commentExists = post.comments.find(
            (comment) => comment._id?.toString() === req.params.commentId
        );
        if (!commentExists) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('comment'),
                    STATUS_CODE.notFound()
                )
            );
        }

        post.comments = post.comments.filter(
            (comment) => comment._id?.toString() !== req.params.commentId
        );
        post.save();
        return commentExists;
    }
}
