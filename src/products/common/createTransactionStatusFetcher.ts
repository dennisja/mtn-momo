import { AxiosInstance } from 'axios';

import { urlPathFrom } from '../../client';
import { Product } from '../../types';

import { TransactionParty } from './types';
import { TRANSACTION_URL_PATHS } from './utils';

const TransactionStatusReasonCodes = [
  'PAYEE_NOT_FOUND',
  'PAYER_NOT_FOUND',
  'NOT_ALLOWED',
  'NOT_ALLOWED_TARGET_ENVIRONMENT',
  'INVALID_CALLBACK_URL_HOST',
  'INVALID_CURRENCY',
  'SERVICE_UNAVAILABLE',
  'INTERNAL_PROCESSING_ERROR',
  'NOT_ENOUGH_FUNDS',
  'PAYER_LIMIT_REACHED',
  'PAYEE_NOT_ALLOWED_TO_RECEIVE',
  'PAYMENT_NOT_APPROVED',
  'RESOURCE_NOT_FOUND',
  'APPROVAL_REJECTED',
  'EXPIRED',
  'TRANSACTION_CANCELED',
  'RESOURCE_ALREADY_EXIST',
] as const;

type TransactionStatusReasonCode =
  (typeof TransactionStatusReasonCodes)[number];

type TransactionStatus =
  | 'PENDING'
  | 'SUCCESSFUL'
  | 'FAILED'
  | 'TIMEOUT'
  | 'REJECTED';

type Transaction<TargetProduct extends Product> = {
  /** Amount that will be debited from the payer account */
  amount: number;

  /** ISO4217 Currency */
  currency: string;

  /** Financial transactionId from a mobile money manager. Used to connect to the specific financial transaction made in the account */
  financialTransactionId: string;

  /**
   * External id is used as a reference to the transaction. External id is used for reconciliation.
   * The external id will be included in transaction history report.
   * External id is not required to be unique.
   */
  externalId: string;

  /**  */
  status: TransactionStatus;
  reason?: {
    code: TransactionStatusReasonCode;
    message: string;
  };

  /** Message that will be written in the payer transaction history message field. */
  payerMessage?: string;

  /** Message that will be written in the payee transaction history note field. */
  payeeNote?: string;
} & TransactionParty<TargetProduct>;

type CreateTransactionStatusFetcherOptions<T extends Product> = {
  /**
   * The client to use when fetching the payment status.
   * Its different for different product endpoint and different for different versions of the same product endpoints
   */
  client: AxiosInstance;

  /** The target product */
  targetProduct: T;
};

type TransactionStatusFetcherOptions = {
  /**
   * UUID of transaction to get result.
   *  Reference id used when creating the request to pay for a collection or the transfer for disbursement and remittance.
   */
  referenceId: string;
};

type FetchTransactionStatus<T extends Product> = (
  options: TransactionStatusFetcherOptions
) => Promise<Transaction<T>>;

type CreateTransactionStatusFetcher = <T extends Product>(
  options: CreateTransactionStatusFetcherOptions<T>
) => FetchTransactionStatus<T>;

const createTransactionStatusFetcher: CreateTransactionStatusFetcher =
  ({ client, targetProduct }) =>
  async ({ referenceId }) => {
    const path = urlPathFrom([
      TRANSACTION_URL_PATHS[targetProduct],
      referenceId,
    ]);
    const response = await client.get(path);
    return response.data;
  };

export { createTransactionStatusFetcher };
export type { FetchTransactionStatus };
