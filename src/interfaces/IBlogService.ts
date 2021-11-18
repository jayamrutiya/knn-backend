import {
  CreateBlogWriter,
  GetBlog,
  GetBlogWriter,
  NewBlog,
  UpdateBlog,
} from '../types/Blog';

export interface IBlogService {
  createBlog(newBlog: NewBlog): Promise<GetBlog>;

  getBlog(blogId: bigint): Promise<GetBlog>;

  getAllBlog(): Promise<GetBlog[]>;

  updateBlog(updateBlog: UpdateBlog): Promise<boolean>;

  getBlogWriter(): Promise<any>;

  createBlogWrite(
    newCreateBlogWriter: CreateBlogWriter,
  ): Promise<GetBlogWriter>;

  deleteBlog(blogId: bigint): Promise<boolean>;
}
