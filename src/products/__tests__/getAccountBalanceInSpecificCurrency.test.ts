import nock from 'nock';
import { describe, expect, it } from 'vitest';

import { BASE_URL } from '../../client';
import { Product } from '../../types';
import { collectionService, disbursementService } from './services';
import { withAuth } from './testUtils';

describe.concurrent.each([
  { product: Product.Disbursement, service: disbursementService },
  { product: Product.Collection, service: collectionService },
])(
  'getAccountBalanceInSpecificCurrency for $product service',
  ({ product, service }) => {
    const mockCurrency = 'UGX';
    const path = `/${product}/v1_0/account/balance/${mockCurrency}`;
    const getBalance = () =>
      service.getAccountBalanceInSpecificCurrency({ currency: mockCurrency });
    const mockResponse = { availableBalance: '15000', currency: mockCurrency };

    it('should get the account balance', async () => {
      withAuth(nock(BASE_URL).get(path).reply(200, mockResponse), product);

      const accountBalance = await getBalance();
      expect(accountBalance).toEqual(mockResponse);
    });

    it('should throw an error when the api throws an error', async () => {
      withAuth(
        nock(BASE_URL)
          .get(path)
          .reply(400, { error: 'Request not understood' }),
        product
      );
      await expect(getBalance).rejects.toThrowError();
    });

    it('should throw an error when authentication fails', async () => {
      nock(BASE_URL).get(path).reply(200, mockResponse);
      await expect(getBalance).rejects.toThrowError();
    });
  }
);
