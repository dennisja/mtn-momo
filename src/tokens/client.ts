import { AxiosInstance } from 'axios';

import { BASE_URL, createClient } from '../client';
import { Product, TargetEnvironment } from '../types';

type CreateTokenClientOptions = {
  /** The product you want to generate an authentication token for */
  targetProduct: Product;

  /** Subscription key which provides access to a target product API. Its is the primary key of each product */
  subscriptionKey: string;

  /** The environment we are targeting. Can either be 'sandbox or production' */
  targetEnvironment: TargetEnvironment;

  /** The id of the api user */
  userId: string;

  /** The apiKey of the user */
  apiKey: string;
};

const clientCache: Partial<Record<Product, AxiosInstance>> = {};

/**
 * Creates a client to use when generating authentication tokens. Ensures a single client is created for the same product.
 * @param {CreateTokenClientOptions} options options to use when creating a token generating client
 * @returns {AxiosInstance} the client you can use to talk to token generation endpoints
 */
const createTokenClient = ({
  subscriptionKey,
  targetEnvironment,
  targetProduct,
  userId,
  apiKey,
}: CreateTokenClientOptions): AxiosInstance => {
  let client = clientCache[targetProduct];

  if (client) return client;

  const baseURL = BASE_URL + targetProduct;
  const authToken = Buffer.from(`${userId}:${apiKey}`).toString('base64');

  client = createClient({
    subscriptionKey,
    headerOverrides: {
      'X-Target-Environment': targetEnvironment,
      Authorization: `Basic ${authToken}`,
    },
    baseURL,
  });

  clientCache[targetProduct] = client;
  return client;
};

export { createTokenClient };
export type { CreateTokenClientOptions };
