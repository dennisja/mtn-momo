import { Product } from '../types';

import { createProductClient } from './client';
import type { CreateProductClientOptions } from './client';
import { createTransactionInitiator } from './createTransactionInitiator';
import type { InitiateTransaction } from './createTransactionInitiator';
import { createTransactionStatusFetcher } from './createTransactionStatusFetcher';
import type { FetchTransactionStatus } from './createTransactionStatusFetcher';

type CreateRemittanceAPIOptions = Omit<
  CreateProductClientOptions,
  'targetProduct'
>;

type CreateRemittanceAPIResult = {
  /**
   * Transfer operation is used to transfer an amount from the own account to a payee account.
   */
  transfer: InitiateTransaction;

  /**
   * This operation is used to get the status of a transfer.
   */
  getTransferStatus: FetchTransactionStatus<Product.Remittance>;
};

const createRemittanceAPI = (
  options: CreateRemittanceAPIOptions
): CreateRemittanceAPIResult => {
  const client = createProductClient({
    ...options,
    targetProduct: Product.Remittance,
  });

  const transfer = createTransactionInitiator({
    client,
    targetProduct: Product.Remittance,
  });

  const getTransferStatus = createTransactionStatusFetcher({
    client,
    targetProduct: Product.Remittance,
  });

  return { transfer, getTransferStatus };
};

export { createRemittanceAPI };
