import { AxiosInstance } from 'axios';
import { urlPathFrom } from '../../client';

type RequestToPayDeliveryNotificationOptions = {
  /** The referenceId of the transaction  */
  referenceId: string;

  /** The message to send in the delivery notification. Max length 160. */
  notificationMessage: string;

  /**
   * An ISO 639-1 or ISO 639-3 language code. The language is used to select
   * the best matching notification template when sending the delivery
   * notification to the end-user. A default value is used if not specified.
   */
  language?: string;
};

type RequestToPayDeliveryNotificationResult = Pick<
  RequestToPayDeliveryNotificationOptions,
  'notificationMessage'
>;

type RequestToPayDeliveryNotification = (
  options: RequestToPayDeliveryNotificationOptions
) => Promise<RequestToPayDeliveryNotificationResult>;

type CreateRequestToPayDeliveryNotificationOptions = { client: AxiosInstance };

type CreateRequestToPayDeliveryNotification = (
  options: CreateRequestToPayDeliveryNotificationOptions
) => RequestToPayDeliveryNotification;

const createRequestToPayDeliveryNotification: CreateRequestToPayDeliveryNotification =

    ({ client }) =>
    async ({ referenceId, notificationMessage, language: Language }) => {
      const path = urlPathFrom([
        '/requesttopay/',
        referenceId,
        '/deliverynotification',
      ]);
      await client.post(
        path,
        {
          notificationMessage,
        },
        { headers: { Language } }
      );
      return { notificationMessage };
    };

export { createRequestToPayDeliveryNotification };
export type { RequestToPayDeliveryNotification };
