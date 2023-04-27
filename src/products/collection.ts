import { Product } from '../types';

import { createProductClient } from './common/client';
import type { CreateProductClientOptions } from './common/client';
import {
  FetchAccountBalance,
  createAccountBalanceFetcher,
} from './common/createAccountBalanceFetcher';
import { createTransactionInitiator } from './common/createTransactionInitiator';
import type { InitiateTransaction } from './common/createTransactionInitiator';
import { createTransactionStatusFetcher } from './common/createTransactionStatusFetcher';
import type { FetchTransactionStatus } from './common/createTransactionStatusFetcher';

type CreateCollectionAPIOptions = Omit<
  CreateProductClientOptions,
  'targetProduct'
>;

type CreateCollectionAPIResult = {
  /**
   * This operation is used to request a payment from a consumer (Payer). The payer will be asked to authorize the payment.
   * The transaction will be executed once the payer has authorized the payment.
   * The requesttopay will be in status PENDING until the transaction is authorized or declined by the payer or it is timed out by the system.
   * Status of the transaction can be validated by using the requestToPayTransactionStatus method
   */
  requestToPay: InitiateTransaction<Product.Collection>;

  /**
   * This operation is used to get the status of a request to pay
   */
  requestToPayTransactionStatus: FetchTransactionStatus<Product.Collection>;

  /** Get the balance of the account */
  getAccountBalance: FetchAccountBalance;
};

/**
 * Creates methods to access the collections API
 * @param options Properties to use when creating functions to access the collections API
 * @returns {CreateCollectionAPIResult} Methods to access the collections API
 */
const createCollectionAPI = (
  options: CreateCollectionAPIOptions
): CreateCollectionAPIResult => {
  const client = createProductClient({
    ...options,
    targetProduct: Product.Collection,
  });

  const requestToPay = createTransactionInitiator({
    client,
    targetProduct: Product.Collection,
  });

  const requestToPayTransactionStatus = createTransactionStatusFetcher({
    client,
    targetProduct: Product.Collection,
  });

  const getAccountBalance = createAccountBalanceFetcher({ client });

  return { requestToPay, requestToPayTransactionStatus, getAccountBalance };
};

export { createCollectionAPI };
