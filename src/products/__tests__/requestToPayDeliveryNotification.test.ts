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
])(
  'requestToPayDeliveryNotification for $product service',
  ({ product, service }) => {
    const mockReferenceId = 'mockReferenceId';
    const path = `/${product}/v1_0/requesttopay/${mockReferenceId}/deliverynotification`;
    const mockNotificationMessage = 'Hello Momo';
    const mockNotificationInfo = {
      notificationMessage: mockNotificationMessage,
    };
    const requestNotification = () =>
      service.requestToPayDeliveryNotification({
        referenceId: mockReferenceId,
        notificationMessage: mockNotificationMessage,
      });

    it('should get the user info', async () => {
      withAuth(
        nock(BASE_URL).post(path).reply(200, mockNotificationInfo),
        product
      );

      const notificationResult = await requestNotification();
      expect(notificationResult).toEqual(mockNotificationInfo);
    });

    it('should throw an error when the api throws an error', async () => {
      withAuth(
        nock(BASE_URL)
          .post(path)
          .reply(400, { error: 'Request not understood' }),
        product
      );
      await expect(requestNotification).rejects.toThrowError();
    });

    it('should throw an error when authentication fails', async () => {
      nock(BASE_URL).post(path).reply(200, mockNotificationInfo);
      await expect(requestNotification).rejects.toThrowError();
    });
  }
);
