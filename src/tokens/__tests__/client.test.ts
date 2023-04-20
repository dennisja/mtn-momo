import { describe, expect, it } from 'vitest';
import { createTokenClient } from '../client';
import { Product, TargetEnvironment } from '../../types';

const createClient = (targetProduct = Product.Collection) => {
  const userId = 'mockUserId';
  const apiKey = 'mockApiKey';
  const subscriptionKey = 'mockCollectionsAPIKey';
  const authToken = Buffer.from(`${userId}:${apiKey}`).toString('base64');
  const client = createTokenClient({
    userId,
    apiKey,
    targetProduct,
    subscriptionKey,
    targetEnvironment: TargetEnvironment.Sandbox,
  });
  return { client, authToken };
};

describe('createTokenClient', () => {
  it('should create a client with the correct baseURL and headers', () => {
    const { authToken, client } = createClient();
    expect(client.defaults.baseURL).toBe(
      'https://sandbox.momodeveloper.mtn.com/collection'
    );
    expect(client.defaults.headers).toMatchObject({
      'X-Target-Environment': TargetEnvironment.Sandbox,
      Authorization: `Basic ${authToken}`,
    });
  });

  it('should not create a different client for the same product', () => {
    const { client: client1 } = createClient();
    const { client: client2 } = createClient();
    expect(client1).toBe(client2);
  });

  it('should create a different client for different products', () => {
    const { client: collectionClient } = createClient();
    const { client: disbursementClient } = createClient(Product.Disbursement);
    expect(collectionClient).not.toBe(disbursementClient);
  });
});
