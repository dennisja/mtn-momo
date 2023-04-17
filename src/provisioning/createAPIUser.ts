import { AxiosInstance, HttpStatusCode } from "axios";
import { v4 } from "uuid";

type CreateAPIUserOptions = {
  /** The link you want some payment operations to redirect to. */
  providerCallbackHost: string;

  /** The client to make the api request */
  client: AxiosInstance;
};

type CreateAPIUserResult = {
  /** A uuid which corresponds to the id of the created user in the sandbox */
  userId: string;
};

/**
 * Creates a user and returns the userId of the created user in the sandbox
 * @param {CreateAPIUserOptions} options properties needed to create a user id
 * @returns {Promise<CreateAPIUserResult>} An object containing the userId of the created user
 */
const createAPIUser = async ({
  client,
  providerCallbackHost,
}: CreateAPIUserOptions): Promise<CreateAPIUserResult> => {
  const userId = v4();

  const response = await client.post(
    "",
    { providerCallbackHost },
    { headers: { "X-Reference-Id": userId } }
  );

  if (response.status === HttpStatusCode.Created) {
    return { userId };
  }

  throw new Error("Unknown error occurred when creating a user");
};

export { createAPIUser };
