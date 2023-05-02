import { HttpStatusCode } from 'axios';
import nock from 'nock';
import { describe, it, expect } from 'vitest';

import { BASE_URL } from '../../client';
import { createAPIKey } from '../createAPIKey';
import { createProvisioningClient } from '../client';

describe('createAPIKey', () => {
  const client = createProvisioningClient({
    subscriptionKey: 'mockSubKey',
    apiVersion: 'v1',
  });
  const mockAPIKey = 'mockAPIKey';
  const mockUserId = 'mockUserId';
  const createKey = () =>
    createAPIKey({
      client,
      userId: mockUserId,
    });
  const path = `/v1_0/apiuser/${mockUserId}/apikey`;

  it('should create and return API key', async () => {
    const mockResult = { apiKey: mockAPIKey };
    nock(BASE_URL).post(path).reply(HttpStatusCode.Created, mockResult);
    const result = await createKey();
    expect(result).toEqual(mockResult);
  });

  it('should throw an error if an error occurs', async () => {
    nock(BASE_URL).post(path).reply(HttpStatusCode.BadRequest);
    expect(createKey).rejects.toThrow();
  });
});
