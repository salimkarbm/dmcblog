import { NextFunction, Request } from 'express';
import { IUser } from '../models/user.model';
import UserRepository from '../repositories/user.repository';
import AppError from '../utils/errors/appError';
import STATUS_CODE from '../shared/constants';
import ERROR_MESSAGE from '../shared/message/error';
import { generateHash, generateToken, isPasswordCorrect } from '../utils';

const userRepo = new UserRepository();

export default class AuthService {
    public async signUp(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const userExists = await userRepo.findOne({
            email: req.body.email
        });
        if (userExists) {
            return next(
                new AppError(
                    ERROR_MESSAGE.ALREADY_EXISTS('user'),
                    STATUS_CODE.conflict()
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

    public async signIn(
        req: Request,
        next: NextFunction
    ): Promise<(IUser & { accessToken: string; refreshToken: string }) | void> {
        const user = await userRepo.findOne(
            { email: req.body.email },
            {},
            true
        );
        if (!user) {
            return next(
                new AppError(
                    ERROR_MESSAGE.INCORRECT_EMAIL,
                    STATUS_CODE.unprocessableEntity()
                )
            );
        }
        if (!(await isPasswordCorrect(req.body.password, user.password))) {
            return next(
                new AppError(
                    ERROR_MESSAGE.INCORRECT_PASSWORD,
                    STATUS_CODE.unprocessableEntity()
                )
            );
        }
        const { accessToken, refreshToken } = await generateToken(user.email);
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = user.toObject();
        const data = { accessToken, refreshToken, ...userWithoutPassword };
        return data;
    }
}
