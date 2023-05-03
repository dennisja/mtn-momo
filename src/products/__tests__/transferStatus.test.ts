import nock from 'nock';
import { describe, expect, it } from 'vitest';

import { BASE_URL, urlPathFrom } from '../../client';
import { Product } from '../../types';
import {
  collectionService,
  disbursementService,
  remittanceService,
} from './services';
import { withAuth } from './testUtils';
import { TRANSACTION_URL_PATHS } from '../common/utils';

describe.concurrent.each([
  { product: Product.Disbursement, service: disbursementService },
  { product: Product.Remittance, service: remittanceService },
])('transfer for $product service', ({ product, service }) => {
  const mockReferenceId = 'mockReferenceId';
  const path = urlPathFrom([
    `/${product}`,
    'v1_0',
    TRANSACTION_URL_PATHS[product],
    mockReferenceId,
  ]);
  const mockResponse = {
    amount: 100,
    currency: 'UGX',
    financialTransactionId: 23503452,
    externalId: 947354,
    payee: {
      partyIdType: 'MSISDN',
      partyId: 4656473839.0,
    },
    status: 'SUCCESSFUL',
  };

  const transferStatus = () =>
    service.getTransferStatus({ referenceId: mockReferenceId });

  it('should fetch a transaction status', async () => {
    withAuth(nock(BASE_URL).get(path).reply(200, mockResponse), product);
    const result = await transferStatus();
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when the api throws an error', async () => {
    withAuth(
      nock(BASE_URL).get(path).reply(400, { error: 'Request not understood' }),
      product
    );
    await expect(transferStatus).rejects.toThrowError();
  });

  it('should throw an error when authentication fails', async () => {
    nock(BASE_URL).get(path).reply(200, '');
    await expect(transferStatus).rejects.toThrowError();
  });
});

describe.concurrent('requestToPayTransactionStatus', () => {
  const mockReferenceId = 'mockReferenceId';
  const path = urlPathFrom([
    `/collection`,
    'v1_0',
    TRANSACTION_URL_PATHS.collection,
    mockReferenceId,
  ]);
  const mockResponse = {
    amount: 100,
    currency: 'UGX',
    financialTransactionId: 23503452,
    externalId: 947354,
    payer: {
      partyIdType: 'MSISDN',
      partyId: 4656473839.0,
    },
    status: 'SUCCESSFUL',
  };

  const requestToPayTransactionStatus = () =>
    collectionService.requestToPayTransactionStatus({
      referenceId: mockReferenceId,
    });

  it('should fetch a transaction status', async () => {
    withAuth(nock(BASE_URL).get(path).reply(200, mockResponse));
    const result = await requestToPayTransactionStatus();
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when the api throws an error', async () => {
    withAuth(
      nock(BASE_URL).get(path).reply(400, { error: 'Request not understood' })
    );
    await expect(requestToPayTransactionStatus).rejects.toThrowError();
  });

  it('should throw an error when authentication fails', async () => {
    nock(BASE_URL).get(path).reply(200, '');
    await expect(requestToPayTransactionStatus).rejects.toThrowError();
  });
});
