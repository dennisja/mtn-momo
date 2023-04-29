import { AxiosInstance } from 'axios';
import { urlPathFrom } from '../../client';

enum AccountHolderIdVariant {
  msisdn = 'msisdn',
  email = 'email',
  partyCode = 'party_code',
}

type ValidateAccountHolderStatusOptions = {
  /**
   * Specifies the type of the party ID. Allowed values [msisdn, email, party_code].
   * accountHolderId should explicitly be in small letters.
   */
  accountHolderIdType: AccountHolderIdVariant;

  /**
   * The party number. Validated according to the party ID type (case Sensitive).
   * msisdn - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   * email - Validated to be a valid e-mail format. Validated with IsEmail
   * party_code - UUID of the party. Validated with IsUuid
   */
  accountHolderId: string;
};

type ValidateAccountHolderStatus = (
  options: ValidateAccountHolderStatusOptions
) => Promise<boolean>;

const createValidateAccountHolderStatus =
  ({ client }: { client: AxiosInstance }) =>
  async ({
    accountHolderIdType,
    accountHolderId,
  }: ValidateAccountHolderStatusOptions): Promise<boolean> => {
    const path = urlPathFrom([
      '/accountholder/',
      accountHolderIdType,
      accountHolderId,
      '/active',
    ]);
    const { data } = await client.get<{ result: boolean }>(path);
    return data.result;
  };

export { createValidateAccountHolderStatus, AccountHolderIdVariant };
export type { ValidateAccountHolderStatus };
