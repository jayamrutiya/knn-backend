import {
  CreateBlogWriter,
  GetBlog,
  GetBlogWriter,
  NewBlog,
  UpdateBlog,
} from '../types/Blog';

export interface IBlogRepository {
  createBlog(newBlog: NewBlog): Promise<GetBlog>;

  getBlog(blogId: bigint): Promise<GetBlog>;

  getAllBlog(): Promise<GetBlog[]>;

  updateBlog(updateBlog: UpdateBlog): Promise<boolean>;

  createBlogWrite(
    newCreateBlogWriter: CreateBlogWriter,
  ): Promise<GetBlogWriter>;

  deleteBlog(blogId: bigint): Promise<boolean>;
}
