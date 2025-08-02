import { Router } from 'express';
import authRoute from './auth/auth.route';
import postRoute from './posts/post.route';
import userRoute from './users/user.routes';

const router = Router();

// authentication routes
router.use(authRoute);

// post routes
router.use('/posts', postRoute);

// user routes
router.use('/users', userRoute);

export default router;
