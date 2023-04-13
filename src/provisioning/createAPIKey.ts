import { AxiosInstance, HttpStatusCode } from "axios";
import { urlPathFrom } from "../client";

type CreateAPIKeyOptions = {
  userId: string;
  client: AxiosInstance;
};

type CreateAPIKeyResult = {
  apiKey: string;
};

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
