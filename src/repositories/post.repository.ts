import { BaseRepository } from '../database/base.repository';
import { Post, PostDocument } from '../models/post.model';

export default class PostRepository extends BaseRepository<PostDocument> {
    constructor() {
        super(Post);
    }
}
