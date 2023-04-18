import axios from 'axios';
import path from 'path';

import type { APIVersion } from './types';

const V2_PATH = 'v2_0';

const V1_PATH = 'v1_0';

const DEFAULT_CONTENT_TYPE = 'application/json';

const API_VERSION_PATH: Record<APIVersion, string> = {
  v1: V1_PATH,
  v2: V2_PATH,
};

const urlPathFrom = (paths: string[]): string => path.join(...paths);

const BASE_URL = 'https://sandbox.momodeveloper.mtn.com';

type HeaderOverrides = {
  'Content-Type'?: string;
  'X-Target-Environment'?: string;
  Authorization?: string;
};

type ClientOptions = {
  subscriptionKey: string;

  baseURL?: string;
  headerOverrides?: HeaderOverrides;
};

const createClient = ({
  subscriptionKey,
  baseURL = BASE_URL,
  headerOverrides,
}: ClientOptions) =>
  axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      ...headerOverrides,
    },
    baseURL,
  });

export {
  API_VERSION_PATH,
  BASE_URL,
  DEFAULT_CONTENT_TYPE,
  createClient,
  urlPathFrom,
};
