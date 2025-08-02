import { Router } from 'express';
import { getUserValidationRules } from '../../middlewares/validation/user.validation.middleware';
import validate from '../../middlewares/validation/request.validation.middleware';
import authenticate from '../../middlewares/auth/authentication.middleware';
import { myPost } from '../../controllers/post.controller';

const router = Router();

router
    .route('/:userId/posts')
    .get(getUserValidationRules(), validate, authenticate, myPost);

export default router;
