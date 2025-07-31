import { NextFunction, Request } from 'express';
import { IUser } from '../models/user.model';
import UserRepository from '../repositories/user.repository';
import AppError from '../utils/Errors/appError';
import STATUS_CODE from '../shared/constants';
import ERROR_MESSAGE from '../shared/message/error';
import { generateHash } from '../utils';

const userRepo = new UserRepository();

export default class AuthService {
    public async signUp(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const userExists = await userRepo.findOne({ email: req.body.email });
        if (userExists) {
            return next(
                new AppError(
                    ERROR_MESSAGE.ALREADY_EXISTS('user'),
                    STATUS_CODE.badRequest()
                )
            );
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(
                new AppError(
                    ERROR_MESSAGE.PASSWORD_MISMATCH,
                    STATUS_CODE.badRequest()
                )
            );
        }

        req.body.password = await generateHash(req.body.password);

        const user = await userRepo.create(req.body);
        return user;
    }

    public async signIn(req: any, next: NextFunction): Promise<IUser | void> {
        return req.user;
    }
}
