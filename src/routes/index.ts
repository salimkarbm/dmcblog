import { Router } from 'express';
import authRoute from './auth/auth.route';
import postRoute from './posts/post.route';

const router = Router();

// authentication routes
router.use(authRoute);

// post routes
router.use('/posts', postRoute);

export default router;
