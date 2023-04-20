import { CreateTokenClientOptions, createTokenClient } from './client';

type CreateOAuthTokenOptions = {
  authRequestId: string; // not documented in API
  grantType: string; // not documented in api
} & CreateTokenClientOptions;

type CreateOAuthTokenRequestResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
  refresh_token_expired_in: number;
};

type CreateOAuthTokenResult = {
  /** The Oauth2 JWT access token.The generated token is valid 3600 seconds as default. */
  accessToken: string;

  /** The value is Bearer */
  tokenType: string;

  /** Shows when the authentication request ID expires, in seconds. */
  expiresIn: number;

  /** A list of scopes that belongs to the authentication request ID. */
  scope: string;

  /** A UUID of the refresh_token */
  refreshToken: string;

  /** The time in seconds until the consent can no longer be refreshed. Based on the default value for consent validity, or the value set to parameter consent_valid_in sent in the bc-authorize request. */
  refreshTokenExpiredIn: number;
};

/**
 * Claims a consent by the account holder for the requested scopes. Unfortunately this in not currently tested
 * because their is no documentation in the api of what the grantType and authRequestId. I will check if anything
 * makes sense later and either fix it or delete it
 * @param {CreateOAuthTokenOptions} options the properties needed to create an OAuth2 token
 * @returns {Promise<CreateOAuthTokenResult>} The details of the OAuth2 token
 */
const createOAuthToken = async ({
  authRequestId,
  grantType,
  ...tokenClientOptions
}: CreateOAuthTokenOptions): Promise<CreateOAuthTokenResult> => {
  const client = createTokenClient(tokenClientOptions);
  const { data } = await client.post<CreateOAuthTokenRequestResponse>(
    '/oauth2/token/',
    {
      grant_type: grantType,
      auth_req_id: authRequestId,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return {
    accessToken: data.access_token,
    tokenType: data.token_type,
    expiresIn: data.expires_in,
    scope: data.scope,
    refreshToken: data.refresh_token,
    refreshTokenExpiredIn: data.refresh_token_expired_in,
  };
};

export { createOAuthToken };
export type { CreateOAuthTokenOptions, CreateOAuthTokenResult };
