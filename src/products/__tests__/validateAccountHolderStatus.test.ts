import nock from 'nock';
import { describe, expect, it } from 'vitest';

import { BASE_URL } from '../../client';
import { Product } from '../../types';
import { AccountHolderIdVariant } from '../common/createValidateAccountHolderStatus';

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
])(
  'validateAccountHolderStatus for $product service',
  ({ product, service }) => {
    const accountHolderId = '256779840633';
    const accountHolderIdType = AccountHolderIdVariant.msisdn;
    const path = `/${product}/v1_0/accountholder/${accountHolderIdType}/${accountHolderId}/active`;

    it('should get the status of the account holder', async () => {
      const mockResponse = { result: true };
      withAuth(nock(BASE_URL).get(path).reply(200, mockResponse), product);

      const status = await service.validateAccountHolderStatus({
        accountHolderId,
        accountHolderIdType,
      });
      expect(status).toEqual(mockResponse.result);
    });

    it('should throw an error when the api throws an error', async () => {
      withAuth(
        nock(BASE_URL)
          .get(path)
          .reply(400, { error: 'Request not understood' }),
        product
      );
      await expect(service.getAccountBalance).rejects.toThrowError();
    });

    it('should throw an error when authentication fails', async () => {
      const mockResponse = { result: true };
      nock(BASE_URL).get(path).reply(200, mockResponse);
      await expect(service.getAccountBalance).rejects.toThrowError();
    });
  }
);
