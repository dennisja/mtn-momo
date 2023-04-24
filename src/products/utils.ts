import { Product } from '../types';

const PRODUCT_URL_PATHS: Record<Product, string> = {
  collection: '/requesttopay',
  disbursement: '/transfer',
  remittance: '/transfer',
};

export { PRODUCT_URL_PATHS };
