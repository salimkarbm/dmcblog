import { Router } from 'express';
import validate from '../../middlewares/validation/request.validation.middleware';
import {
    createPost,
    fetchPostComments,
    fetchPosts,
    findPost,
    findPostComment,
    postComment,
    removePost,
    removePostComment,
    updatePost,
    updatePostComment
} from '../../controllers/post.controller';
import {
    createPostValidationRules,
    fetchPostsValidationRules,
    getCommentValidationRules,
    getPostValidationRules,
    postCommentValidationRules,
    updateCommentValidationRules,
    updatePostValidationRules
} from '../../middlewares/validation/post.validation.middleware';
import authenticate from '../../middlewares/auth/authentication.middleware';

const router = Router();

router
    .route('/')
    .post(createPostValidationRules(), validate, authenticate, createPost)
    .get(fetchPostsValidationRules(), validate, fetchPosts);

router
    .route('/:postId')
    .get(getPostValidationRules(), validate, findPost)
    .patch(updatePostValidationRules(), validate, authenticate, updatePost)
    .delete(getPostValidationRules(), validate, authenticate, removePost);

router
    .route('/:postId/comments')
    .post(postCommentValidationRules(), validate, authenticate, postComment)
    .get(getPostValidationRules(), validate, fetchPostComments);

router
    .route('/:postId/comments/:commentId')
    .get(getCommentValidationRules(), validate, findPostComment)
    .patch(
        updateCommentValidationRules(),
        validate,
        authenticate,
        updatePostComment
    )
    .delete(
        getCommentValidationRules(),
        validate,
        authenticate,
        removePostComment
    );

export default router;
