import { HttpStatusCode } from 'axios';
import nock from 'nock';
import * as uuid from 'uuid';
import { describe, expect, it, vi } from 'vitest';

import { BASE_URL } from '../../client';
import { createProvisioningClient } from '../client';
import { createAPIUser } from '../createAPIUser';

describe('createAPIUser', () => {
  const client = createProvisioningClient({
    subscriptionKey: 'mockSubKey',
    apiVersion: 'v1',
  });
  const mockUserId = 'mockUserId';
  const createUser = () =>
    createAPIUser({
      client,
      providerCallbackHost: 'localhost',
    });

  it('should create an api user and return the user id', async () => {
    vi.spyOn(uuid, 'v4').mockReturnValueOnce(mockUserId);
    nock(BASE_URL).post('/v1_0/apiuser').reply(HttpStatusCode.Created, '');
    const { userId } = await createUser();
    expect(userId).toBe(mockUserId);
  });

  it('should throw an error when api throws an error', async () => {
    vi.spyOn(uuid, 'v4').mockReturnValueOnce(mockUserId);
    nock(BASE_URL).post('/v1_0/apiuser').reply(HttpStatusCode.BadRequest, '');
    await expect(createUser).rejects.toThrowError();
  });
});
