import {
  CreateBlogWriter,
  GetBlog,
  GetBlogWithTotal,
  GetBlogWriter,
  NewBlog,
  UpdateBlog,
} from '../types/Blog';

export interface IBlogService {
  createBlog(newBlog: NewBlog): Promise<GetBlog>;

  getBlog(blogId: bigint): Promise<GetBlog>;

  getAllBlog(page: number, size: number): Promise<GetBlogWithTotal>;

  updateBlog(updateBlog: UpdateBlog): Promise<boolean>;

  getBlogWriter(): Promise<any>;

  createBlogWrite(
    newCreateBlogWriter: CreateBlogWriter,
  ): Promise<GetBlogWriter>;

  deleteBlog(blogId: bigint): Promise<boolean>;

  deleteBlogWriter(id: bigint): Promise<boolean>;
}
