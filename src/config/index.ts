const configuration = () => ({
    APP: {
        port: parseInt(process.env.PORT as string, 10) || 3000,
        database: {
            uri: process.env.DB_URI || 'mongodb://localhost/ubedu'
        },
        app_name: process.env.APP_NAME,
        environment: process.env.NODE_ENV
    },

    JWT: {
        secret: process.env?.JWT_SECRET as string,
        expiresIn: process.env?.JWT_EXPIRY as string,
        access_token_expires_in: process.env?.JWT_ACCESS_TOKEN_EXPIRY as string,
        refresh_token_expires_in: process.env
            .JWT_REFRESH_TOKEN_EXPIRY as string,
        access_token_secret: process.env?.JWT_ACCESS_TOKEN_SECRET as string,
        refresh_token_secret: process.env?.JWT_REFRESH_TOKEN_SECRET as string
    },

    BCRYPT: {
        saltRound: parseInt(process.env.SALT_ROUND as string, 10) || 10,
        pepper: process.env.BCRYPT_PASSWORD as string
    },

    CLOUDINARY: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
});
export default configuration();
