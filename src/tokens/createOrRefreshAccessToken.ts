import { Product } from '../types';
import {
  createAccessToken,
  CreateAccessTokenOptions,
  CreateAccessTokenResult,
} from './createAccessToken';

type TokenDetails = CreateAccessTokenResult;

type TokenDetailsVariant = Product;

const tokenCache: Partial<Record<TokenDetailsVariant, TokenDetails>> = {};

const createOrRefreshAccessToken = async (
  options: CreateAccessTokenOptions
): Promise<TokenDetails> => {
  let tokenDetails = tokenCache[options.targetProduct];
  const isExpired = Date.now() > (tokenDetails?.expiresAt || 0);

  if (!tokenDetails || isExpired) {
    tokenDetails = await createAccessToken(options);
    tokenCache[options.targetProduct] = tokenDetails;
  }

  return tokenDetails;
};

export { createOrRefreshAccessToken };
