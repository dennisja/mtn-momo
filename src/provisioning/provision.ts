import { TargetEnvironment } from "../types";
import { createProvisioningClient } from "./client";
import { createAPIKey } from "./createAPIKey";
import { createAPIUser } from "./createAPIUser";
import { fetchAPIUser } from "./fetchAPIUser";

type CreateAPIUserResult = {
  targetEnvironment: TargetEnvironment;
  apiKey: string;
  userId: string;
  subscriptionKey: string;
  providerCallbackHost: string;
};

type CreateAPIUserAndKeyOptions = {
  subscriptionKey: string;
  providerCallbackHost: string;
};

const createAPIUserAndKey = async ({
  subscriptionKey,
  providerCallbackHost,
}: CreateAPIUserAndKeyOptions): Promise<CreateAPIUserResult> => {
  const client = createProvisioningClient({
    subscriptionKey,
    apiVersion: "v1",
  });
  const { userId } = await createAPIUser({ client, providerCallbackHost });
  const { apiKey } = await createAPIKey({ userId, client });
  const { targetEnvironment } = await fetchAPIUser({
    userId,
    client,
  });

  return {
    userId,
    apiKey,
    targetEnvironment,
    subscriptionKey,
    providerCallbackHost,
  };
};

export { createAPIUserAndKey };
