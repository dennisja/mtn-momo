import { AxiosInstance } from 'axios';

import { BASE_URL, createClient, urlPathFrom } from '../client';
import { APIVersion, Product, TargetEnvironment } from '../types';

type CreateTokenClientOptions = {
  subscriptionKey: string;
  targetEnvironment: TargetEnvironment;
  targetProduct: Product;
  userId: string;
  apiKey: string;

  apiVersion?: APIVersion;
};

let client: AxiosInstance | null;

const createTokenClient = ({
  subscriptionKey,
  targetEnvironment,
  targetProduct,
  userId,
  apiKey,
}: CreateTokenClientOptions): AxiosInstance => {
  if (client) return client;

  const baseURL = urlPathFrom([BASE_URL, targetProduct]);
  const authToken = Buffer.from(`${userId}:${apiKey}`).toString('base64');

  return createClient({
    subscriptionKey,
    headerOverrides: {
      'X-Target-Environment': targetEnvironment,
      Authorization: `Basic ${authToken}`,
    },
    baseURL,
  });
};

export { createTokenClient };
export type { CreateTokenClientOptions };
