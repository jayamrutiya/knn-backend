import { GetBlog, NewBlog, UpdateBlog } from '../types/Blog';

export default interface IBlogRepository {
  createBlog(newBlog: NewBlog): Promise<GetBlog>;

  getBlog(blogId: bigint): Promise<GetBlog>;

  getAllBlog(): Promise<GetBlog[]>;

  updateBlog(updateBlog: UpdateBlog): Promise<boolean>;
}
