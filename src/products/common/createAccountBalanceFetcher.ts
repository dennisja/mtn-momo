import { AxiosInstance } from 'axios';
import { urlPathFrom } from '../../client';

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

type FetchAccountBalanceInSpecificCurrency = (
  options: Pick<AccountBalance, 'currency'>
) => Promise<AccountBalance>;

const createAccountBalanceFetcher =
  ({ client }: CreateAccountBalanceFetcherOptions) =>
  async (options?: { currency: string }) => {
    const currency = options?.currency || '';
    const path = urlPathFrom(['/account', 'balance', currency]);
    const { data } = await client.get<AccountBalance>(path);
    return data;
  };

export { createAccountBalanceFetcher };
export type { FetchAccountBalance, FetchAccountBalanceInSpecificCurrency };
