import { AxiosInstance } from 'axios';

type CreateAccessTokenOptions = {
  client: AxiosInstance;
};

type CreateAccessTokenRequestResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type CreateAccessTokenResult = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

const createAccessToken = async ({
  client,
}: CreateAccessTokenOptions): Promise<CreateAccessTokenResult> => {
  const { data } = await client.post<CreateAccessTokenRequestResponse>(
    '/token/'
  );
  return {
    accessToken: data.access_token,
    tokenType: data.token_type,
    expiresIn: data.expires_in,
  };
};

export { createAccessToken };
export type { CreateAccessTokenResult, CreateAccessTokenOptions };
