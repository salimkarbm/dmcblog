import { Router } from 'express';
import {
    loginValidationRules,
    signUpValidationRules
} from '../../middlewares/validation/auth.validation.middleware';
import { signUp, signIn } from '../../controllers/auth.controller';
import validate from '../../middlewares/validation/request.validation.middleware';

const router = Router();

router.post('/auth/signUp', signUpValidationRules(), validate, signUp);
router.post('/auth/signIn', loginValidationRules(), validate, signIn);

export default router;
