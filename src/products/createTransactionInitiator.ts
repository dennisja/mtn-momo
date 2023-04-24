import { AxiosInstance } from 'axios';
import { v4 } from 'uuid';

import { Product } from '../types';

import { PRODUCT_URL_PATHS } from './utils';
import { Party } from './types';

type RequestToPayResult = {
  /**
   * Resource ID of the created request to pay transaction.
   * This ID is used, for example, validating the status of the request.
   * ‘Universal Unique ID’ for the transaction generated using UUID version 4.
   */
  referenceId: string;
};

type RequestToPayOptions = {
  /** Amount that will be debited from the payer account. */
  amount: string;

  /** ISO4217 Currency */
  currency: string;

  /**
   * External id is used as a reference to the transaction.
   * External id is used for reconciliation.
   * The external id will be included in transaction history report.
   * External id is not required to be unique.
   */
  externalId: string;

  /**
   * Details of the account holder in the wallet platform
   */
  payer: Party;

  /** Message that will be written in the payer transaction history message field. */
  payerMessage: string;

  /** Message that will be written in the payee transaction history note field. */
  payeeNote: string;

  /**  URL to the server where the callback should be sent. */
  callbackURL?: string;
};

type CreateTransactionInitiatorOptions<T extends Product> = {
  /**
   * The client to use when initiating a payment.
   * Its different for different product endpoint and different for different versions of the same product endpoints
   */
  client: AxiosInstance;

  /** The target product */
  targetProduct: T;
};

type InitiateTransaction = (
  options: RequestToPayOptions
) => Promise<RequestToPayResult>;

type TransactionInitiatorCreator = <T extends Product>(
  options: CreateTransactionInitiatorOptions<T>
) => InitiateTransaction;

/**
 * Creates a function to initiate an payment.
 * @param options Options to use when creating a function to initiate a payment.
 * @returns A function that is used to initiate a payment.  The payer will be asked to authorize the payment.
 * The transaction will be executed once the payer has authorized the payment.
 * The payment request will be in status PENDING until the transaction is authorized or declined by the payer or it is timed out by the system.
 */
const createTransactionInitiator: TransactionInitiatorCreator =
  ({ client, targetProduct }) =>
  async ({ callbackURL, ...body }) => {
    const referenceId = v4();
    const path = PRODUCT_URL_PATHS[targetProduct];
    await client.post(path, body, {
      headers: { 'X-Callback-Url': callbackURL, 'X-Reference-Id': referenceId },
    });
    return { referenceId };
  };

export { createTransactionInitiator };
export type { InitiateTransaction };
