import { Product } from '../types';

import { createProductClient } from './client';
import type { CreateProductClientOptions } from './client';
import { createTransactionInitiator } from './createTransactionInitiator';
import type { InitiateTransaction } from './createTransactionInitiator';
import { createTransactionStatusFetcher } from './createTransactionStatusFetcher';
import type { FetchTransactionStatus } from './createTransactionStatusFetcher';

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
  requestToPay: InitiateTransaction;

  /**
   * This operation is used to get the status of a request to pay
   */
  requestToPayTransactionStatus: FetchTransactionStatus<Product.Collection>;
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

  return { requestToPay, requestToPayTransactionStatus };
};

export { createCollectionAPI };
