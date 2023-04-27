import { AxiosInstance } from 'axios';

type BasicUserInfoResult = {
  updated_at: number;
  given_name: string;
  family_name: string;
  birthdate: string;
  locale: string;
  gender: string;
  status: string;
  name: string;
  sub: string;
};

type BasicUserInfo = {
  /**
   * Given name(s) or first name(s) of the End-User.
   * Note that in some cultures, people can have multiple given names; all can be present,
   * with the names being separated by space characters.
   */
  givenName: string;

  /** Surname(s) or last name(s) of the End-User.
   * Note that in some cultures, people can have multiple family names or no family name;
   * all can be present, with the names being separated by space characters.
   */
  familyName: string;

  /** Combined givenName and familyName */
  name: string;

  /** Account holder birth date. */
  birthDate: string;

  /**
   * End-User's locale, represented as a  BCP47 [RFC5646] language tag.
   * This is typically an  ISO 639-1 Alpha-2 [ISO639�|�1] language code in lowercase
   * and an  ISO 3166-1 Alpha-2 [ISO3166�|�1] country code in uppercase, separated by a dash.
   * For example,  en-US or  fr-CA. As a compatibility note, some implementations have used an
   * underscore as the separator rather than a dash, for example,  en_US; Relying Parties may
   * choose to accept this locale syntax as well.
   */
  locale: string;

  /**
   * End-User's gender. Values defined by this specification are female and male.
   *  Other values may be used when neither of the defined values are applicable
   */
  gender: string;

  /** Account holder status. */
  status: string;

  /** Timestamp in seconds indicating when user was last updated */
  updatedAt: number;

  sub: string;
};

type FetchBasicUserInfoOptions = {
  /** The phone number of the user whose info we are fetching */
  accountHolderMSISDN: string;
};

type FetchBasicUserInfo = (
  options: FetchBasicUserInfoOptions
) => Promise<BasicUserInfo>;

const createBasicUserInfoFetcher =
  ({ client }: { client: AxiosInstance }) =>
  async ({
    accountHolderMSISDN,
  }: FetchBasicUserInfoOptions): Promise<BasicUserInfo> => {
    const { data } = await client.get<BasicUserInfoResult>(
      `accountholder/msisdn/${accountHolderMSISDN}/basicuserinfo`
    );
    const { sub, status, gender, name, locale } = data;
    return {
      sub,
      status,
      gender,
      name,
      locale,
      birthDate: data.birthdate,
      givenName: data.given_name,
      familyName: data.family_name,
      updatedAt: data.updated_at,
    };
  };

export { createBasicUserInfoFetcher };
export type { FetchBasicUserInfo };
