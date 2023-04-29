import nock from 'nock';
import { describe, expect, it } from 'vitest';

import { BASE_URL } from '../../client';
import { Product } from '../../types';
import {
  collectionService,
  disbursementService,
  remittanceService,
} from './services';
import { withAuth } from './testUtils';

describe.concurrent.each([
  { product: Product.Disbursement, service: disbursementService },
  { product: Product.Collection, service: collectionService },
  { product: Product.Remittance, service: remittanceService },
])('getAccountBalance for $product service', ({ product, service }) => {
  const path = `/${product}/v1_0/account/balance`;

  it('should get the account balance', async () => {
    const mockResponse = { availableBalance: '15000', currency: 'UGX' };
    withAuth(nock(BASE_URL).get(path).reply(200, mockResponse), product);

    const accountBalance = await service.getAccountBalance();
    expect(accountBalance).toEqual(mockResponse);
  });

  it('should throw an error when the api throws an error', async () => {
    withAuth(
      nock(BASE_URL).get(path).reply(400, { error: 'Request not understood' }),
      product
    );
    await expect(service.getAccountBalance).rejects.toThrowError();
  });

  it('should throw an error when authentication fails', async () => {
    const mockResponse = { availableBalance: '15000', currency: 'UGX' };
    nock(BASE_URL).get(path).reply(200, mockResponse);
    await expect(service.getAccountBalance).rejects.toThrowError();
  });
});
