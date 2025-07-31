import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import UserRepository from '../../repositories/user.repository';
import AppError from '../../utils/Errors/appError';
import { verifyJWT } from '../../utils';

const userRepo = new UserRepository();

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token;
        if (!req.headers.authorization) {
            return res.status(401).json({
                message:
                    'please provide an authorization header to gain access',
                success: false
            });
        }
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                message: 'Invalid authorization header',
                success: false
            });
        }
        const decoded = (await verifyJWT(token)) as JwtPayload;
        if (decoded.expired === true) {
            return next(new AppError('Expired token please login', 403));
        }
        const currentUser = await userRepo.findOne({ _id: decoded.payload.id });
        if (!currentUser) {
            return res.status(401).json({
                message: 'the user belongs to the token no longer exist.',
                success: false
            });
        }
        req.user = currentUser;
        next();
    } catch (error) {
        return next(
            new AppError(`something went wrong here is the error ${error}`, 500)
        );
    }
};

export default authenticate;
