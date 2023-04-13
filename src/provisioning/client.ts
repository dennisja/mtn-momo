import type { AxiosInstance } from "axios";

import {
  API_VERSION_PATH,
  BASE_URL,
  createClient,
  urlPathFrom,
} from "../client";
import type { APIVersion } from "../types";

let client: AxiosInstance | null;

type CreateProvisioningClientOptions = {
  subscriptionKey: string;
  apiVersion: APIVersion;
};

const createProvisioningClient = ({
  subscriptionKey,
}: CreateProvisioningClientOptions) => {
  if (client) return client;

  const baseURL = urlPathFrom([BASE_URL, API_VERSION_PATH.v1, "apiuser"]);

  return createClient({ subscriptionKey, baseURL });
};

export { createProvisioningClient };
