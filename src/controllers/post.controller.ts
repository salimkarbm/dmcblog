import { NextFunction, Response } from 'express';
import AppError from '../utils/errors/appError';
import STATUS_CODE from '../shared/constants';
import PostService from '../services/post.service';
import SUCCESS_MESSAGE from '../shared/message/success';

const postService = new PostService();

export const createPost = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.createPost(req, next);
        return res.status(STATUS_CODE.created()).json({
            status: 'success',
            message: SUCCESS_MESSAGE.CREATED('Post'),
            data
        });
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const fetchPosts = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.fetchPosts(req, next);
        if (data) {
            return res.status(STATUS_CODE.ok()).json({
                status: 'success',
                message: SUCCESS_MESSAGE.FETCHED('Post'),
                data
            });
        }
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const findPost = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.findPost(req, next);
        if (data) {
            return res.status(STATUS_CODE.ok()).json({
                status: 'success',
                message: SUCCESS_MESSAGE.FETCHED('Post'),
                data
            });
        }
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const myPost = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.userPosts(req, next);
        if (data) {
            return res.status(STATUS_CODE.ok()).json({
                status: 'success',
                message: SUCCESS_MESSAGE.FETCHED('Post'),
                data
            });
        }
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const updatePost = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.updatePost(req, next);
        if (data) {
            return res.status(STATUS_CODE.ok()).json({
                status: 'success',
                message: SUCCESS_MESSAGE.UPDATED('Post'),
                data
            });
        }
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const removePost = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.removePost(req, next);
        if (data) {
            return res.status(STATUS_CODE.ok()).json({
                status: 'success',
                message: SUCCESS_MESSAGE.DELETED('Post'),
                data
            });
        }
    } catch (err) {
        console.log(err);
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const postComment = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.postComment(req, next);
        return res.status(STATUS_CODE.created()).json({
            status: 'success',
            message: SUCCESS_MESSAGE.CREATED('Comment'),
            data
        });
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const fetchPostComments = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.fetchPostComments(req, next);
        return res.status(STATUS_CODE.ok()).json({
            status: 'success',
            message: SUCCESS_MESSAGE.FETCHED('Comment'),
            data
        });
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const findPostComment = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.findPostComment(req, next);
        return res.status(STATUS_CODE.ok()).json({
            status: 'success',
            message: SUCCESS_MESSAGE.FETCHED('Comment'),
            data
        });
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const updatePostComment = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.updatePostComment(req, next);
        return res.status(STATUS_CODE.ok()).json({
            status: 'success',
            message: SUCCESS_MESSAGE.UPDATED('Comment'),
            data
        });
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const removePostComment = async (
    req: Record<string, any>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await postService.removePostComment(req, next);
        return res.status(STATUS_CODE.ok()).json({
            status: 'success',
            message: SUCCESS_MESSAGE.DELETED('Comment'),
            data
        });
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};
