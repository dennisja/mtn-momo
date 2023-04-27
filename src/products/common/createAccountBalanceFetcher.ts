import { AxiosInstance } from 'axios';

type CreateAccountBalanceFetcherOptions = {
  /** The client to fetch the account balance */
  client: AxiosInstance;
};

type AccountBalance = {
  /**  The available balance of the account */
  availableBalance: string;

  /** ISO4217 Currency */
  currency: string;
};

type FetchAccountBalance = () => Promise<AccountBalance>;

const createAccountBalanceFetcher =
  ({ client }: CreateAccountBalanceFetcherOptions) =>
  async () => {
    const { data } = await client.get<AccountBalance>('/account/balance');
    return data;
  };

export { createAccountBalanceFetcher };
export type { FetchAccountBalance };
