import { NextFunction } from 'express';
import AppError from '../utils/errors/appError';
import STATUS_CODE from '../shared/constants';
import PostRepository from '../repositories/post.repository';
import { IPost } from '../models/post.model';
import { cloudinaryUpload, getFilePath } from '../utils';
import ERROR_MESSAGE from '../shared/message/error';
import UserRepository from '../repositories/user.repository';
import { UserDocument } from '../models/user.model';

const postRepo = new PostRepository();
const userRepo = new UserRepository();

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
        const post = await postRepo.findWithPagination(
            { active: true },
            {
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        );
        return post;
    }

    public async findPost(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<IPost | void> {
        const post = await postRepo.findOne({ _id: req.params.postId });
        if (!post) {
            return next(
                new AppError(
                    ERROR_MESSAGE.NOT_FOUND('post'),
                    STATUS_CODE.notFound()
                )
            );
        }
        return post as IPost;
    }

    public async myPosts(
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
}
