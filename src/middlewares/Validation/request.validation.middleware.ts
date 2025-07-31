import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import STATUS_CODE from '../../shared/constants';

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const resultErrors = [];
    errors
        .array()
        .map((err: any) => resultErrors.push({ [err.path]: err.msg }));

    resultErrors.push({ message: 'Action unsuccessful' });
    resultErrors.push({ success: false });
    const errorObject = Object.assign({}, ...resultErrors);
    return res.status(STATUS_CODE.unprocessableEntity()).json(errorObject);
};

export default validate;
