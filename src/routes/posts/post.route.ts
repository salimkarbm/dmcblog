import { Router } from 'express';
import validate from '../../middlewares/validation/request.validation.middleware';
import {
    createPost,
    fetchPosts,
    findPost
    // myPost
} from '../../controllers/post.controller';
import {
    createPostValidationRules,
    fetchPostsValidationRules,
    getPostValidationRules
} from '../../middlewares/validation/post.validation.middleware';
import authenticate from '../../middlewares/auth/authentication.middleware';
// import { getUserValidationRules } from '../../middlewares/validation/user.validation.middleware';

const router = Router();

router
    .route('/')
    .post(createPostValidationRules(), validate, authenticate, createPost)
    .get(fetchPostsValidationRules(), validate, fetchPosts);

router.route('/:postId').get(getPostValidationRules(), validate, findPost);

// router
//     .route('/:userId/posts')
//     .get(getUserValidationRules(), validate, authenticate, myPost);

export default router;
