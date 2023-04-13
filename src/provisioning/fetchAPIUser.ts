import { AxiosInstance, HttpStatusCode } from "axios";
import type { TargetEnvironment } from "../types";

type FetchAPIUserOptions = {
  userId: string;
  client: AxiosInstance;
};

type FetchAPIUserResult = {
  targetEnvironment: TargetEnvironment;
  providerCallbackHost: string;
};

const fetchAPIUser = async ({
  userId,
  client,
}: FetchAPIUserOptions): Promise<FetchAPIUserResult> => {
  const res = await client.get<FetchAPIUserResult>(`/${userId}`);

  if (res.status === HttpStatusCode.Ok) {
    return res.data;
  }

  /** TODO: search and see whether there is a reasonable way to do error handling from the docus */
  throw new Error("Unknown error when fetching user");
};

export { fetchAPIUser };
