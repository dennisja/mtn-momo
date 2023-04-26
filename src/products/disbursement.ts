import { Product } from '../types';

import { createProductClient } from './common/client';
import type { CreateProductClientOptions } from './common/client';
import { createTransactionInitiator } from './common/createTransactionInitiator';
import type { InitiateTransaction } from './common/createTransactionInitiator';
import { createTransactionStatusFetcher } from './common/createTransactionStatusFetcher';
import type { FetchTransactionStatus } from './common/createTransactionStatusFetcher';

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
