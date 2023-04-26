import { AxiosInstance } from 'axios';

import {
  API_VERSION_PATH,
  BASE_URL,
  createClient,
  urlPathFrom,
} from '../../client';
import { APIVersion, Product, TargetEnvironment } from '../../types';

import { withAuthorization } from './withAuthorization';

type CreateProductClientOptions = {
  subscriptionKey: string;
  targetEnvironment: TargetEnvironment;
  targetProduct: Product;
  apiKey: string;
  userId: string;
  apiVersion?: APIVersion;
};

type Client = `${Product}-${APIVersion}`;

const clientCache: Partial<Record<Client, AxiosInstance>> = {};

const createProductClient = ({
  subscriptionKey,
  targetEnvironment,
  apiVersion = 'v1',
  targetProduct,
  userId,
  apiKey,
}: CreateProductClientOptions): AxiosInstance => {
  const clientKey: Client = `${targetProduct}-${apiVersion}`;
  let client = clientCache[clientKey];

  if (client) return client;

  const baseURL =
    BASE_URL + urlPathFrom([targetProduct, API_VERSION_PATH[apiVersion]]);

  client = createClient({
    subscriptionKey,
    headerOverrides: {
      'X-Target-Environment': targetEnvironment,
    },
    baseURL,
  });

  withAuthorization({
    client,
    config: {
      apiKey,
      userId,
      targetProduct,
      subscriptionKey,
      targetEnvironment,
    },
  });

  clientCache[clientKey] = client;
  return client;
};

export { createProductClient };
export type { CreateProductClientOptions };
