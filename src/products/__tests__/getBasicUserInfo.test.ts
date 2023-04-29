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
])('getBasicUserInfo for $product service', ({ product, service }) => {
  const mockUserInfo = {
    sub: '0',
    name: 'Sand Box',
    given_name: 'Sand',
    family_name: 'Box',
    birthdate: '1976-08-13',
    locale: 'sv_SE',
    gender: 'MALE',
    updated_at: 1682620297,
  };
  const formattedUserInfo = {
    sub: mockUserInfo.sub,
    name: mockUserInfo.name,
    locale: mockUserInfo.locale,
    gender: mockUserInfo.gender,
    familyName: mockUserInfo.family_name,
    givenName: mockUserInfo.given_name,
    birthDate: mockUserInfo.birthdate,
    updatedAt: mockUserInfo.updated_at,
  };
  const accountHolderMSISDN = '256779840633';
  const path = `/${product}/v1_0/accountholder/msisdn/${accountHolderMSISDN}/basicuserinfo`;

  it('should get the user info', async () => {
    withAuth(nock(BASE_URL).get(path).reply(200, mockUserInfo), product);

    const userInfo = await service.getBasicUserInfo({
      accountHolderMSISDN,
    });
    expect(userInfo).toEqual(formattedUserInfo);
  });

  it('should throw an error when the api throws an error', async () => {
    withAuth(
      nock(BASE_URL).get(path).reply(400, { error: 'Request not understood' }),
      product
    );
    await expect(service.getBasicUserInfo).rejects.toThrowError();
  });

  it('should throw an error when authentication fails', async () => {
    nock(BASE_URL).get(path).reply(200, mockUserInfo);
    await expect(service.getBasicUserInfo).rejects.toThrowError();
  });
});
