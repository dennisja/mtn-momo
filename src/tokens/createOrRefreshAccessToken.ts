import { Product } from '../types';
import {
  createAccessToken,
  CreateAccessTokenOptions,
  CreateAccessTokenResult,
} from './createAccessToken';

type TokenDetails = CreateAccessTokenResult & { expiresAt: number };

type TokenDetailsVariant = `${Product}`;

let tokenCache: Partial<Record<TokenDetailsVariant, TokenDetails>>;

const EXPIRY_OFFSET = 30000; // 30 seconds

const createOrRefreshAccessToken = async (
  options: CreateAccessTokenOptions
): Promise<TokenDetails> => {
  let tokenDetails = tokenCache[options.targetProduct];
  const isExpired = Date.now() > (tokenDetails?.expiresAt || 0);

  if (!tokenDetails || isExpired) {
    const accessTokenDetails = await createAccessToken(options);
    const { expiresIn } = accessTokenDetails;
    const expiresAt = Date.now() + expiresIn * 1000 - EXPIRY_OFFSET;
    tokenDetails = { ...accessTokenDetails, expiresAt };
    tokenCache[options.targetProduct] = tokenDetails;
  }

  return tokenDetails;
};

export { createOrRefreshAccessToken };
