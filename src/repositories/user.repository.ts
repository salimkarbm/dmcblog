import { User, UserDocument } from '../models/user.model';
import { BaseRepository } from '../database/base.repository';

export default class UserRepository extends BaseRepository<UserDocument> {
    constructor() {
        super(User);
    }
}
