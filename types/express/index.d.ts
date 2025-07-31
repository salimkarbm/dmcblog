import { User } from '../../src/models/user.model';

declare global {
    declare namespace Express {
        interface Request {
            user: User;
        }
    }
}
