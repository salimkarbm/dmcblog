const ERROR_MESSAGE = {
    NOT_FOUND: (name: string, id?: string) => {
        if (!id) {
            return `${name} not found`;
        }
        return `${name} with ID: ${id} not found`;
    },
    BAD_REQUEST: 'BAD REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    CONFLICT: 'CONFLICT',
    SERVER_ERROR: 'SERVER ERROR',
    ALREADY_EXISTS: (name: string) => `${name} already exists`,
    PASSWORD_MISMATCH: 'Passwords do not match'
};

export default ERROR_MESSAGE;
