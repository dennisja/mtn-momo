import nock from 'nock';
import * as uuid from 'uuid';
import { describe, expect, it, vi } from 'vitest';

import { BASE_URL, urlPathFrom } from '../../client';
import { Product } from '../../types';
import {
  collectionService,
  disbursementService,
  remittanceService,
} from './services';
import { withAuth } from './testUtils';
import { TRANSACTION_URL_PATHS } from '../common/utils';
import { PartyIDVariant } from '../common/types';

describe.concurrent.each([
  { product: Product.Disbursement, service: disbursementService },
  { product: Product.Remittance, service: remittanceService },
])('transfer for $product service', ({ product, service }) => {
  const path = urlPathFrom([
    `/${product}`,
    'v1_0',
    TRANSACTION_URL_PATHS[product],
  ]);
  const mockReferenceId = 'mockReferenceId';
  vi.spyOn(uuid, 'v4').mockReturnValue(mockReferenceId);
  const transactionPayload = {
    amount: '15000',
    currency: 'UGX',
    externalId: '123456789',
    payee: {
      partyIdType: PartyIDVariant.MSISDN,
      partyId: '256759840633',
    },
    payerMessage: 'message',
    payeeNote: 'note',
  };
  const transact = () => service.transfer(transactionPayload);

  it('should make a transfer and return the referenceId of the transaction', async () => {
    withAuth(
      nock(BASE_URL)
        .post(path, JSON.stringify(transactionPayload))
        .reply(200, ''),
      product
    );
    const { referenceId } = await transact();
    expect(referenceId).toEqual(mockReferenceId);
  });

  it('should throw an error when the api throws an error', async () => {
    withAuth(
      nock(BASE_URL)
        .post(path, JSON.stringify(transactionPayload))
        .reply(400, { error: 'Request not understood' }),
      product
    );
    await expect(transact).rejects.toThrowError();
  });

  it('should throw an error when authentication fails', async () => {
    nock(BASE_URL)
      .post(path, JSON.stringify(transactionPayload))
      .reply(200, '');
    await expect(transact).rejects.toThrowError();
  });
});

describe.concurrent('requestToPay', () => {
  const path = urlPathFrom([
    '/collection',
    'v1_0',
    TRANSACTION_URL_PATHS.collection,
  ]);

  const mockReferenceId = 'mockReferenceId';
  vi.spyOn(uuid, 'v4').mockReturnValue(mockReferenceId);
  const transactionPayload = {
    amount: '1000',
    currency: 'EUR',
    externalId: '012345678',
    payer: {
      partyIdType: PartyIDVariant.MSISDN,
      partyId: '256779840633',
    },
    payerMessage: 'message',
    payeeNote: 'note',
  };
  const requestToPay = () => collectionService.requestToPay(transactionPayload);

  it('should make a a requestToPay and return the referenceId of the transaction', async () => {
    withAuth(
      nock(BASE_URL)
        .post(path, JSON.stringify(transactionPayload))
        .reply(200, '')
    );
    const { referenceId } = await requestToPay();
    expect(referenceId).toEqual(mockReferenceId);
  });

  it('should throw an error when the api throws an error', async () => {
    withAuth(
      nock(BASE_URL)
        .post(path, JSON.stringify(transactionPayload))
        .reply(400, { error: 'Request not understood' })
    );
    await expect(requestToPay).rejects.toThrowError();
  });

  it('should throw an error when authentication fails', async () => {
    nock(BASE_URL)
      .post(path, JSON.stringify(transactionPayload))
      .reply(200, '');
    await expect(requestToPay).rejects.toThrowError();
  });
});
