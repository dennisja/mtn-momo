import { CreateTokenClientOptions, createTokenClient } from './client';

const EXPIRY_OFFSET = 30000; // 30 seconds

type CreateAccessTokenOptions = CreateTokenClientOptions;

type CreateAccessTokenRequestResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type CreateAccessTokenResult = {
  /** The authentication token you will use to access other endpoints */
  accessToken: string;

  /** The  token type */
  tokenType: string;

  /** The validity time in seconds of the token. */
  expiresIn: number;

  /** The timestamp in milliseconds at which the token will expiry offset by 30 secs */
  expiresAt: number;
};

/**
 * Create an access token which can then be used to authorize and authenticate towards the other end-points of the API. Throws errors from the API when request is not successful
 * @param {CreateAccessTokenOptions} options the properties you need to create an access token
 * @returns {Promise<CreateAccessTokenResult>} the access token details
 */
const createAccessToken = async (
  options: CreateAccessTokenOptions
): Promise<CreateAccessTokenResult> => {
  const client = createTokenClient(options);
  const { data } = await client.post<CreateAccessTokenRequestResponse>(
    '/token/'
  );
  const expiresAt = Date.now() + data.expires_in * 1000 - EXPIRY_OFFSET;
  return {
    expiresAt,
    accessToken: data.access_token,
    tokenType: data.token_type,
    expiresIn: data.expires_in,
  };
};

export { createAccessToken };
export type { CreateAccessTokenResult, CreateAccessTokenOptions };
