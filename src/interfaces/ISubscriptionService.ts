import { GetSubscription } from '../types/Subscription';

export interface ISubscriptionService {
  getSubscription(subscriptionId: bigint): Promise<GetSubscription>;

  getAllSubscription(): Promise<GetSubscription[]>;

  userBuySubscription(userId: bigint, subscriptionId: bigint): Promise<boolean>;
}
