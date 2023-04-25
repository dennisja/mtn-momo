import { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { createOrRefreshAccessToken } from '../tokens/createOrRefreshAccessToken';
import { CreateAccessTokenOptions } from '../tokens';

const withAuthorization = ({
  client,
  config,
}: {
  client: AxiosInstance;
  config: CreateAccessTokenOptions;
}): void => {
  client.interceptors.request.use(async (request) => {
    // we don't want this to run at client creation time but at the time a request is made
    const { accessToken } = await createOrRefreshAccessToken(config);
    return {
      ...request,
      headers: {
        ...request.headers,
        Authorization: `Bearer ${accessToken}`,
      } as AxiosRequestHeaders,
    };
  });
};

export { withAuthorization };
