import { describe, expect, it } from 'vitest';

import { APIVersion, Product, TargetEnvironment } from '../../../types';
import { createProductClient } from '../client';

const createClient = ({
  targetProduct = Product.Collection,
  apiVersion = 'v1',
}: {
  targetProduct?: Product;
  apiVersion?: APIVersion;
} = {}) => {
  const userId = 'mockUserId';
  const apiKey = 'mockApiKey';
  const subscriptionKey = 'mockSubscriptionAPIKey';
  const client = createProductClient({
    userId,
    apiKey,
    apiVersion,
    targetProduct,
    subscriptionKey,
    targetEnvironment: TargetEnvironment.Sandbox,
  });
  return { client };
};

describe('createTokenClient', () => {
  it('should create a client with the correct baseURL and headers', () => {
    const { client } = createClient();
    expect(client.defaults.baseURL).toBe(
      'https://sandbox.momodeveloper.mtn.com/collection/v1_0'
    );
    expect(client.defaults.headers).toMatchObject({
      'Ocp-Apim-Subscription-Key': 'mockSubscriptionAPIKey',
      'X-Target-Environment': TargetEnvironment.Sandbox,
      'Content-Type': 'application/json',
    });
  });

  it('should not create a different client for the same product with the same version', () => {
    const { client: client1 } = createClient();
    const { client: client2 } = createClient();
    expect(client1).toBe(client2);
  });

  it('should create a different client for same product but different version', () => {
    const { client: collectionClientV1 } = createClient();
    const { client: collectionClientV2 } = createClient({
      apiVersion: 'v2',
    });
    expect(collectionClientV1).not.toBe(collectionClientV2);
  });

  it('should create a different client for different products', () => {
    const { client: collectionClient } = createClient();
    const { client: disbursementClient } = createClient({
      targetProduct: Product.Disbursement,
    });
    expect(collectionClient).not.toBe(disbursementClient);
  });
});
