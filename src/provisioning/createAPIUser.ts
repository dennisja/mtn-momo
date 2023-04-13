import { AxiosInstance, HttpStatusCode } from "axios";
import { v4 } from "uuid";

type CreateAPIUserOptions = {
  providerCallbackHost: string;
  client: AxiosInstance;
};

type CreateAPIUserResult = {
  userId: string;
};

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
