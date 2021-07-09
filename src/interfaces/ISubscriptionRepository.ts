import {
  CreateUserSubscription,
  CreateUserSubscriptionUsage,
  GetSubscription,
  GetUserSubscription,
  GetUserSubscriptionUsage,
} from '../types/Subscription';

export interface ISubscriptionRepository {
  getSubscription(subscriptionId: bigint): Promise<GetSubscription>;

  getAllSubscription(): Promise<GetSubscription[]>;

  createUserSubscription(
    newUserSubscription: CreateUserSubscription,
  ): Promise<GetUserSubscription>;

  createUserSubscriptionUsage(
    newUserSubscriptionUsage: CreateUserSubscriptionUsage,
  ): Promise<GetUserSubscriptionUsage>;
}
