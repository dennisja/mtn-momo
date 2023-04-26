import { Product } from '../../types';

enum PartyIDVariant {
  MSISDN = 'MSISDN',
  EMAIL = 'EMAIL',
  PARTY_CODE = 'PARTY_CODE',
}

type Party = {
  /**
   * The type of the party ID indicating how the partyId is validated. Can be one of:
   * - EMAIL - Validated to be a valid e-mail format. Validated with IsEmail
   * - MSISDN - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   * - PARTY_CODE - UUID of the party. Validated with IsUuid
   */
  partyIdType: PartyIDVariant;

  /** The id of the party. Should be of the party Id type i.e if partyId type is MSISDN, partyId should be a MSISDN */
  partyId: string;
};

type TransactionParty<TargetProduct extends Product> =
  TargetProduct extends Product.Collection
    ? {
        /** The paying party in the wallet platform */
        payer: Party;
      }
    : {
        /** The party being paid in the wallet platform */
        payee: Party;
      };

export type { Party };
export { PartyIDVariant, TransactionParty };
