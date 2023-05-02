import { Product } from '../types';

import { createProductClient } from './common/client';
import type { CreateProductClientOptions } from './common/client';
import { createAccountBalanceFetcher } from './common/createAccountBalanceFetcher';
import type { FetchAccountBalance } from './common/createAccountBalanceFetcher';
import { createBasicUserInfoFetcher } from './common/createGetBasicUserInfo';
import type { FetchBasicUserInfo } from './common/createGetBasicUserInfo';
import { createRequestToPayDeliveryNotification } from './common/createRequestToPayDeliveryNotification';
import type { RequestToPayDeliveryNotification } from './common/createRequestToPayDeliveryNotification';
import { createTransactionInitiator } from './common/createTransactionInitiator';
import type { InitiateTransaction } from './common/createTransactionInitiator';
import { createTransactionStatusFetcher } from './common/createTransactionStatusFetcher';
import type { FetchTransactionStatus } from './common/createTransactionStatusFetcher';
import { createValidateAccountHolderStatus } from './common/createValidateAccountHolderStatus';
import type { ValidateAccountHolderStatus } from './common/createValidateAccountHolderStatus';

type CreateDisbursementAPIResult = {
  /**
   * Transfer operation is used to transfer an amount from the own account to a payee account.
   */
  transfer: InitiateTransaction<Product.Disbursement>;

  /**
   * This operation is used to get the status of a transfer.
   */
  getTransferStatus: FetchTransactionStatus<Product.Disbursement>;

  /** Get the balance of the account */
  getAccountBalance: FetchAccountBalance;

  /** This operation returns personal information of the account holder. The operation does not need any consent by the account holder. */
  getBasicUserInfo: FetchBasicUserInfo;

  /** This operation is used to check if an account holder is registered and active in the system. */
  validateAccountHolderStatus: ValidateAccountHolderStatus;

  /** This operation is used to send additional Notification to an End User. */
  requestToPayDeliveryNotification: RequestToPayDeliveryNotification;
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

  const getAccountBalance = createAccountBalanceFetcher({ client });

  const getBasicUserInfo = createBasicUserInfoFetcher({ client });

  const validateAccountHolderStatus = createValidateAccountHolderStatus({
    client,
  });

  const requestToPayDeliveryNotification =
    createRequestToPayDeliveryNotification({ client });

  return {
    transfer,
    getTransferStatus,
    getAccountBalance,
    getBasicUserInfo,
    validateAccountHolderStatus,
    requestToPayDeliveryNotification,
  };
};

export { createDisbursementAPI };
