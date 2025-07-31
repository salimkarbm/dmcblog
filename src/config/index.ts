const configuration = () => ({
    APP: {
        port: parseInt(process.env.PORT as string, 10) || 3000,
        database: {
            uri: process.env.DB_URI || 'mongodb://localhost/ubedu'
        },
        app_name: process.env.APP_NAME
    },

    JWT: {
        secret: process.env.JWT_SECRET as string,
        expiresIn: process.env.JWT_EXPIRY as string
    },

    BCRYPT: {
        saltRound: parseInt(process.env.SALT_ROUND as string, 10) || 10,
        pepper: process.env.BCRYPT_PASSWORD as string
    }
});

export default configuration();
