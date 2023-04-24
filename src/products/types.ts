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

  /** */
  partyId: string;
};

export type { Party };
export { PartyIDVariant };
