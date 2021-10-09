import { GetSubscription } from '../types/Subscription';

export interface ISubscriptionService {
  getSubscription(subscriptionId: bigint): Promise<GetSubscription>;

  getAllSubscription(): Promise<GetSubscription[]>;

  userBuySubscription(
    userSubscription: any,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
