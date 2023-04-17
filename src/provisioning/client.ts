import type { AxiosInstance } from 'axios';

import {
  API_VERSION_PATH,
  BASE_URL,
  createClient,
  urlPathFrom,
} from '../client';
import type { APIVersion } from '../types';

let client: AxiosInstance | null;

type CreateProvisioningClientOptions = {
  /**
   * The primary key for any of the subscriptions you want to access. Can be found in your momo developer profile under subscriptions
   * Check out https://momodeveloper.mtn.com/products to subscribe to a product and obtain a subscription key
   */
  subscriptionKey: string;

  /** The version of the api we are accessing. Defaults to v1. At the time of writing of this user provisions only has one version*/
  apiVersion?: APIVersion;
};

/**
 * Creates a client to use when creating api requests for provisioning a user
 * @param {CreateProvisioningClientOptions} options properties to use when creating the client
 * @returns {AxiosInstance} the client to use when making requests to create the user. Its pre configured with the baseURL and common headers needed for these operations.
 */
const createProvisioningClient = ({
  subscriptionKey,
  apiVersion = 'v1',
}: CreateProvisioningClientOptions): AxiosInstance => {
  if (client) return client;

  const baseURL = urlPathFrom([
    BASE_URL,
    API_VERSION_PATH[apiVersion],
    'apiuser',
  ]);

  return createClient({ subscriptionKey, baseURL });
};

export { createProvisioningClient };
