import nock from 'nock';
import { describe, expect, it } from 'vitest';

import { createRemittanceAPI } from '../remittance';
import { Product, TargetEnvironment } from '../../types';
import { BASE_URL } from '../../client';
import { withAuth } from './testUtils';

describe('Remittance', () => {
  const remittanceService = createRemittanceAPI({
    targetEnvironment: TargetEnvironment.Sandbox,
    subscriptionKey: 'mockSubscriptionKey',
    apiKey: 'mockAPIKey',
    apiVersion: 'v1',
    userId: 'mockUserId',
  });

  describe.concurrent('getAccountBalance', () => {
    it('should get the account balance', async () => {
      const mockResponse = { availableBalance: '15000', currency: 'UGX' };
      withAuth(
        nock(BASE_URL)
          .get('/remittance/v1_0/account/balance')
          .reply(200, mockResponse),
        Product.Remittance
      );

      const accountBalance = await remittanceService.getAccountBalance();
      expect(accountBalance).toEqual(mockResponse);
    });

    it('should throw an error when the api throws an error', async () => {
      withAuth(
        nock(BASE_URL)
          .get('/remittance/v1_0/account/balance')
          .reply(400, { error: 'Request not understood' }),
        Product.Remittance
      );
      await expect(remittanceService.getAccountBalance).rejects.toThrowError();
    });

    it('should throw an error when authentication fails', async () => {
      const mockResponse = { availableBalance: '15000', currency: 'UGX' };
      nock(BASE_URL)
        .get('/remittance/v1_0/account/balance')
        .reply(200, mockResponse);
      await expect(remittanceService.getAccountBalance).rejects.toThrowError();
    });
  });
});
