import { body, param, query } from 'express-validator';

export const createPostValidationRules = () => {
    return [
        body('title')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ min: 3 })
            .withMessage('Title must be at least 3 characters'),

        body('content')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Content cannot be empty'),

        // Tags may come as multiple query params: tags=tag1&tags=tag2
        // express-validator will treat that as an array, as long as body-parser does.
        body('tags')
            .optional({ checkFalsy: true })
            .isArray()
            .withMessage('Tags must be an array'),

        body('tags.*')
            .optional()
            .isString()
            .withMessage('Each tag must be a string')
    ];
};

export const fetchPostsValidationRules = () => {
    return [
        query('limit').trim().isNumeric(),
        query('page').trim().isNumeric()
    ];
};

export const getPostValidationRules = () => {
    return [
        param('postId')
            .trim()
            .notEmpty()
            .withMessage('Post ID is required')
            .isMongoId()
            .withMessage('Post ID must be a valid Mongo ID')
    ];
};
