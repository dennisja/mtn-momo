import { Product } from '../../types';

const TRANSACTION_URL_PATHS: Record<Product, string> = {
  collection: '/requesttopay',
  disbursement: '/transfer',
  remittance: '/transfer',
};

export { TRANSACTION_URL_PATHS };
