import { Router } from 'express';
import authRoute from './Auth/auth.route';
import userRoute from './Users/user.routes';

const router = Router();

// authentication routes
router.use(authRoute);

// user routes
router.use('/users', userRoute);

export default router;
