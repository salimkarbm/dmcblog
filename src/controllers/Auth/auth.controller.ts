import { Request, Response, NextFunction } from 'express';
import AppError from '../../utils/Errors/appError';
import AuthService from '../../services/auth.service';
import STATUS_CODE from '../../shared/constants';
import SUCCESS_MESSAGE from '../../shared/message/success';

const authService = new AuthService();

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await authService.signUp(req, next);
        return res.status(STATUS_CODE.created()).json({
            status: 'success',
            message: SUCCESS_MESSAGE.SIGN_UP,
            data
        });
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

export const signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await authService.signIn(req, next);
        return res.status(STATUS_CODE.ok()).json({
            status: 'success',
            message: SUCCESS_MESSAGE.LOGIN,
            data
        });
    } catch (err) {
        return next(
            new AppError(
                `something went wrong! please try gain later.`,
                STATUS_CODE.internalServerError()
            )
        );
    }
};

// export const refreshToken = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const verifiedToken = await authService.refreshToken(req, res, next);
//         return verifiedToken;
//     } catch (error) {
//         return next(
//             new AppError(
//                 `something went wrong! please try gain later.`,
//                 statusCode.internalServerError()
//             )
//         );
//     }
// };

// export const forgotPassword = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const user = await authService.forgotPassword(req, next);
//         if (user) {
//             return res.status(statusCode.accepted()).json({
//                 success: true,
//                 message:
//                     'A password reset code has been sent to your email Successfully.'
//             });
//         }
//     } catch (error) {
//         return next(
//             new AppError(
//                 `something went wrong! please try gain later.`,
//                 statusCode.internalServerError()
//             )
//         );
//     }
// };

// export const resetPassword = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const result = await authService.resetPassword(req, next);
//         if (result) {
//             return res.status(statusCode.ok()).json({
//                 success: true,
//                 message: 'Password reset successfully'
//             });
//         }
//     } catch (error) {
//         return next(
//             new AppError(
//                 `something went wrong! please try gain later.`,
//                 statusCode.internalServerError()
//             )
//         );
//     }
// };
