import nock from 'nock';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

import { BASE_URL } from '../../client';
import { Product, TargetEnvironment } from '../../types';
import { expiresInToExpiresAt } from '../createAccessToken';
import { createOrRefreshAccessToken } from '../createOrRefreshAccessToken';

const createTokenDetails = (targetProduct: Product = Product.Collection) =>
  createOrRefreshAccessToken({
    targetEnvironment: TargetEnvironment.Sandbox,
    targetProduct,
    apiKey: 'mockAPIKey',
    subscriptionKey: 'mockSubscriptionKey',
    userId: 'mockUserId',
  });

describe.concurrent('createOrRefreshAccessToken', () => {
  let dateSpy: ReturnType<typeof vi.spyOn>;
  beforeAll(() => {
    // return a consistent value for Date.now to avoid possibilities of inconsistencies
    dateSpy = vi.spyOn(Date, 'now').mockReturnValue(1);
  });

  afterAll(() => {
    dateSpy.mockClear();
  });

  it('should create new token details if a token does not exist yet for a given product', async () => {
    nock(BASE_URL).post('/collection/token/').reply(201, {
      access_token: 'mockAccessToken',
      token_type: 'mockTokenType',
      expires_in: 2000,
    });
    const tokenDetails = await createTokenDetails();
    expect(tokenDetails).toMatchObject({
      expiresAt: expiresInToExpiresAt(2000),
      accessToken: 'mockAccessToken',
      tokenType: 'mockTokenType',
      expiresIn: 2000,
    });
  });

  it('should not create new token details if a token details for a given product already exist', async () => {
    nock(BASE_URL).post('/collection/token/').reply(201, {
      access_token: 'mockAccessToken',
      token_type: 'mockTokenType',
      expires_in: 2000,
    });
    const collectionTokenDetailsOne = await createTokenDetails();
    const collectionTokenDetailsTwo = await createTokenDetails();
    expect(collectionTokenDetailsOne).toBe(collectionTokenDetailsTwo);
  });

  it('should create new token details if we create a token for a different product', async () => {
    nock(BASE_URL).post('/collection/token/').reply(201, {
      access_token: 'mockAccessToken',
      token_type: 'mockTokenType',
      expires_in: 2000,
    });
    nock(BASE_URL).post('/disbursement/token/').reply(201, {
      access_token: 'mockAccessToken',
      token_type: 'mockTokenType',
      expires_in: 2000,
    });
    const collectionTokenDetails = await createTokenDetails();
    const disbursementTokenDetails = await createTokenDetails(
      Product.Disbursement
    );
    expect(disbursementTokenDetails).not.toBe(collectionTokenDetails);
  });

  it('should create new token details if the existing token has expired', async () => {
    nock(BASE_URL).post('/collection/token/').reply(201, {
      access_token: 'mockAccessToken',
      token_type: 'mockTokenType',
      expires_in: -50000, // use a big negative number to make the token expired
    });
    const firstCollectionTokenDetails = await createTokenDetails();

    nock(BASE_URL).post('/collection/token/').reply(201, {
      access_token: 'mockAccessToken',
      token_type: 'mockTokenType',
      expires_in: 2000,
    });
    const secondCollectionsTokenDetails = await createTokenDetails();
    expect(firstCollectionTokenDetails).not.toBe(secondCollectionsTokenDetails);
  });

  it('should throw an error if fetching a token throws an error', async () => {
    nock(BASE_URL).post('/collection/token/').reply(401);
    const createToken = () => createTokenDetails(Product.Collection);
    await expect(createToken).rejects.toThrow();
  });
});
