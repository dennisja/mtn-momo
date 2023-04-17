import { TargetEnvironment } from '../types';
import { createProvisioningClient } from './client';
import { createAPIKey } from './createAPIKey';
import { createAPIUser } from './createAPIUser';
import { fetchAPIUser } from './fetchAPIUser';

type CreateAPIUserResult = {
  /** The environment which we are accessing. Its always 'sandbox' when in the sandbox environment */
  targetEnvironment: TargetEnvironment;

  /** The key to be used in the authentication header when requesting for an access token */
  apiKey: string;

  /** A uuid which corresponds to the id of the user to be created */
  userId: string;

  /**
   * The primary key for any of the subscriptions you want to access. Can be found in your momo developer profile under subscriptions
   * Check out https://momodeveloper.mtn.com/products to subscribe to a product and obtain a subscription key
   */
  subscriptionKey: string;

  /** The host to redirect to after some actions that require redirection */
  providerCallbackHost: string;
};

type CreateAPIUserAndKeyOptions = Pick<
  CreateAPIUserResult,
  'subscriptionKey' | 'providerCallbackHost'
>;

const createAPIUserAndKey = async ({
  subscriptionKey,
  providerCallbackHost,
}: CreateAPIUserAndKeyOptions): Promise<CreateAPIUserResult> => {
  const client = createProvisioningClient({
    subscriptionKey,
  });
  const { userId } = await createAPIUser({ client, providerCallbackHost });
  const { apiKey } = await createAPIKey({ userId, client });
  const { targetEnvironment } = await fetchAPIUser({
    userId,
    client,
  });

  return {
    userId,
    apiKey,
    targetEnvironment,
    subscriptionKey,
    providerCallbackHost,
  };
};

export { createAPIUserAndKey };
