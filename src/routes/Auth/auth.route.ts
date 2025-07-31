import { Router } from 'express';
import {
    loginValidationRules,
    signUpValidationRules
} from '../../middlewares/Validation/auth.validation.middleware';
import { signUp, signIn } from '../../controllers/Auth/auth.controller';
import validate from '../../middlewares/Validation/request.validation.middleware';

const router = Router();

router.post('/auth/signUp', signUpValidationRules(), validate, signUp);
router.post('/auth/login', loginValidationRules(), validate, signIn);

export default router;
