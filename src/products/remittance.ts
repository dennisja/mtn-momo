import { Product } from '../types';

import { createProductClient } from './common/client';
import type { CreateProductClientOptions } from './common/client';
import { createTransactionInitiator } from './common/createTransactionInitiator';
import type { InitiateTransaction } from './common/createTransactionInitiator';
import { createTransactionStatusFetcher } from './common/createTransactionStatusFetcher';
import type { FetchTransactionStatus } from './common/createTransactionStatusFetcher';

type CreateRemittanceAPIOptions = Omit<
  CreateProductClientOptions,
  'targetProduct'
>;

type CreateRemittanceAPIResult = {
  /**
   * Transfer operation is used to transfer an amount from the own account to a payee account.
   */
  transfer: InitiateTransaction<Product.Remittance>;

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
