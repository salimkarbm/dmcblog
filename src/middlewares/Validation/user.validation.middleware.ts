import { body, oneOf, param } from 'express-validator';

export const updateMeValidationRules = () => {
    return oneOf([
        body('fullName')
            .trim()
            .notEmpty()
            .withMessage('Full Name can not be empty')
            .isString()
            .withMessage('Full Name must be a string'),
        body('address')
            .trim()
            .notEmpty()
            .withMessage('Address can not be empty'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email can not be empty')
            .isEmail()
            .withMessage('Please enter a valid email'),
        body('phoneNumber')
            .notEmpty()
            .withMessage('Phone Number can not be empty')
            .isMobilePhone('any', { strictMode: false })
            .withMessage('Please enter a valid phone number')
    ]);
};

export const changePasswordValidationRules = () => {
    return [
        body('currentPassword')
            .trim()
            .notEmpty()
            .withMessage('current Password can not be empty')
            .isLength({ min: 6, max: 16 })
            .withMessage('Password must be between 1 and 16 characters'),
        body('newPassword')
            .trim()
            .notEmpty()
            .withMessage('new Password can not be empty')
            .isLength({ min: 6, max: 16 })
            .withMessage('Password must be between 1 and 16 characters')
    ];
};

export const getUserValidationRules = () => {
    return [
        param('userId')
            .trim()
            .notEmpty()
            .withMessage('User ID is required')
            .isMongoId()
            .withMessage('User ID must be a valid Mongo ID')
    ];
};
