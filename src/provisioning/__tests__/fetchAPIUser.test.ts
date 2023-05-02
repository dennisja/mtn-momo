import { HttpStatusCode } from 'axios';
import nock from 'nock';
import * as uuid from 'uuid';
import { describe, expect, it, vi } from 'vitest';

import { BASE_URL } from '../../client';
import { TargetEnvironment } from '../../types';
import { createProvisioningClient } from '../client';
import { fetchAPIUser } from '../fetchAPIUser';

describe('fetchAPIUser', () => {
  const client = createProvisioningClient({
    subscriptionKey: 'mockSubKey',
    apiVersion: 'v1',
  });
  const mockUserId = 'mockUserId';
  const fetchUser = () =>
    fetchAPIUser({
      client,
      userId: mockUserId,
    });

  it('should create an api user and return the user details', async () => {
    vi.spyOn(uuid, 'v4').mockReturnValueOnce(mockUserId);
    const mockResult = {
      targetEnvironment: TargetEnvironment.Sandbox,
      providerCallbackHost: 'localhost',
    };
    nock(BASE_URL)
      .get(`/v1_0/apiuser/${mockUserId}`)
      .reply(HttpStatusCode.Created, mockResult);
    const userDetails = await fetchUser();
    expect(userDetails).toEqual(mockResult);
  });

  it('should throw an error when api throws an error', async () => {
    vi.spyOn(uuid, 'v4').mockReturnValueOnce(mockUserId);
    nock(BASE_URL)
      .get(`/v1_0/apiuser/${mockUserId}`)
      .reply(HttpStatusCode.BadRequest, '');
    await expect(fetchUser).rejects.toThrowError();
  });
});
