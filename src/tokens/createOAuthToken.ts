import { AxiosInstance } from 'axios';

type CreateOAuthTokenOptions = {
  client: AxiosInstance;
  authRequestId?: string; // TODO: this shouldn't be optional
};

type CreateOAuthTokenRequestResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
  refresh_token_expired_in: number;
};

type CreateOAuthTokenResult = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
  refreshToken: string;
  refreshTokenExpiredIn: number;
};

const createOAuthToken = async ({
  client,
  authRequestId,
}: CreateOAuthTokenOptions): Promise<CreateOAuthTokenResult> => {
  const { data } = await client.post<CreateOAuthTokenRequestResponse>(
    '/oauth2/token/',
    {
      grant_type: 'urn:openid:params:grant-type:ciba',
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
