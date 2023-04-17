import axios from "axios";
import path from "path";

import type { APIVersion } from "./types";

const V2_PATH = "v2_0";

const V1_PATH = "v1_0";

const DEFAULT_CONTENT_TYPE = "application/json";

const API_VERSION_PATH: Record<APIVersion, string> = {
  v1: V1_PATH,
  v2: V2_PATH,
};

const urlPathFrom = (paths: string[]): string => {
  return path.join(...paths);
};

const BASE_URL = "https://sandbox.momodeveloper.mtn.com";

type ClientOptions = {
  subscriptionKey: string;
  baseURL?: string;
};

const createClient = ({
  subscriptionKey,
  baseURL = BASE_URL,
}: ClientOptions) => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey,
    },
    baseURL,
  });
};

export {
  API_VERSION_PATH,
  BASE_URL,
  DEFAULT_CONTENT_TYPE,
  createClient,
  urlPathFrom,
};
