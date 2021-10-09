export declare type Login = {
  accessToken: string;
  refreshToken: string;
};

export declare type UserToken = {
  id: bigint;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  mobileNumber: string;
  Role: string;
  verify: boolean;
  subscriptionDone: boolean;
};

export declare type RefreshToken = {
  userId: BigInt;
  Token: string;
};
