export declare type GetBlog = {
  id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  blogWriter: bigint;
  createdAt: Date;
  updatedAt: Date | null;
  BlogWriter?: GetBlogWriter;
};

export declare type NewBlog = {
  // id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  blogWriter: bigint;
  // createdAt: Date;
  // updatedAt: Date | null;
};

export declare type UpdateBlog = {
  id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  blogWriter: bigint;
  // createdAt: Date;
  // updatedAt: Date | null;
};

export declare type CreateBlogWriter = {
  // id: bigint;
  name: string;
  profilePicture: string | null;
  emailId: string;
  designation: string;
  about: string;
  fbLink: string;
  instaLink: string;
  ytLink: string;
  // createdAt: Date;
  // updatedAt: Date | null;
};

export declare type GetBlogWriter = {
  id: bigint;
  name: string;
  profilePicture: string | null;
  emailId: string;
  designation: string;
  about: string;
  fbLink: string;
  instaLink: string;
  ytLink: string;
  createdAt: Date;
  updatedAt: Date | null;
};
