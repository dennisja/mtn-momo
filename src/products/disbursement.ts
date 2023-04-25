import { Product } from '../types';

import { createProductClient } from './client';
import type { CreateProductClientOptions } from './client';
import { createTransactionInitiator } from './createTransactionInitiator';
import type { InitiateTransaction } from './createTransactionInitiator';
import { createTransactionStatusFetcher } from './createTransactionStatusFetcher';
import type { FetchTransactionStatus } from './createTransactionStatusFetcher';

type CreateDisbursementAPIResult = {
  /**
   * Transfer operation is used to transfer an amount from the own account to a payee account.
   */
  transfer: InitiateTransaction<Product.Disbursement>;

  /**
   * This operation is used to get the status of a transfer.
   */
  getTransferStatus: FetchTransactionStatus<Product.Disbursement>;
};

type CreateDisbursementAPIOptions = Omit<
  CreateProductClientOptions,
  'targetProduct'
>;

const createDisbursementAPI = (
  options: CreateDisbursementAPIOptions
): CreateDisbursementAPIResult => {
  const client = createProductClient({
    ...options,
    targetProduct: Product.Disbursement,
  });

  const transfer = createTransactionInitiator({
    client,
    targetProduct: Product.Disbursement,
  });

  const getTransferStatus = createTransactionStatusFetcher({
    client,
    targetProduct: Product.Disbursement,
  });

  return { transfer, getTransferStatus };
};

export { createDisbursementAPI };
