import { AxiosInstance, HttpStatusCode } from "axios";
import { urlPathFrom } from "../client";

type CreateAPIKeyOptions = {
  /** A uuid which corresponds to the id of the user whose api key is to be created */
  userId: string;

  /** The instance to use while making the api request */
  client: AxiosInstance;
};

type CreateAPIKeyResult = {
  /** The key to be used in the authentication header when requesting for an access token */
  apiKey: string;
};

/**
 * Create a key to use in the authentication header when requesting for an access token
 * @param {CreateAPIKeyOptions} options properties needed to create an api key
 * @returns {Promise<CreateAPIKeyResult>} An object containing the created apiKey
 */
const createAPIKey = async ({
  userId,
  client,
}: CreateAPIKeyOptions): Promise<CreateAPIKeyResult> => {
  const path = urlPathFrom([userId, "apikey"]);

  const res = await client.post<CreateAPIKeyResult>(path);

  if (res.status === HttpStatusCode.Created) {
    return { apiKey: res.data.apiKey };
  }

  throw new Error("An unknown error occurred when fetching the api key");
};

export { createAPIKey };
