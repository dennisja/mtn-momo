import { AxiosInstance } from 'axios';

import { CreateTokenClientOptions, createTokenClient } from './client';
import { CreateOAuthTokenResult, createOAuthToken } from './createOAuthToken';
import {
  CreateAccessTokenResult,
  createAccessToken,
} from './createAccessToken';

type TokenType = 'OAuthToken' | 'AccessToken';

type CreateTokenOptions<T extends TokenType> = CreateTokenClientOptions & {
  tokenType: T;
};

type TokenDetails<T extends TokenType> = T extends 'OAuthToken'
  ? CreateOAuthTokenResult
  : CreateAccessTokenResult;

const TokenCreator: Record<
  TokenType,
  (options: { client: AxiosInstance }) => Promise<TokenDetails<TokenType>>
> = {
  AccessToken: createAccessToken,
  OAuthToken: createOAuthToken,
};

const createToken = async <T extends TokenType>({
  tokenType,
  ...createTokenClientOptions
}: CreateTokenOptions<T>): Promise<TokenDetails<T>> => {
  const client = createTokenClient(createTokenClientOptions);
  const tokenCreator = TokenCreator[tokenType];
  const tokenDetails = await tokenCreator({ client });
  return tokenDetails as TokenDetails<T>;
};

export { createToken };
export type { TokenType, CreateOAuthTokenResult, CreateAccessTokenResult };
