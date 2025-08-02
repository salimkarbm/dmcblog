import { NextFunction } from 'express';
import AppError from '../utils/errors/appError';
import STATUS_CODE from '../shared/constants';
import PostRepository from '../repositories/post.repository';
import { IPost } from '../models/post.model';
import { cloudinaryUpload, getFilePath } from '../utils';
import ERROR_MESSAGE from '../shared/message/error';

const postRepo = new PostRepository();

export default class PostService {
    public async createPost(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<IPost | void> {
        try {
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
        } catch (err) {
            return next(
                new AppError(
                    `something went wrong! please try gain later.`,
                    STATUS_CODE.internalServerError()
                )
            );
        }
    }

    public async fetchPosts(
        req: Record<string, any>,
        next: NextFunction
    ): Promise<any | void> {
        const { page, limit } = req.query;
        const post = await postRepo.findWithPagination(
            {},
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
        console.log('param', req.params);
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
}
