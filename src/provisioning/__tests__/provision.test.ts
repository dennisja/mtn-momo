import { HttpStatusCode } from 'axios';
import * as uuid from 'uuid';
import nock from 'nock';
import { describe, expect, it, vi } from 'vitest';

import { BASE_URL } from '../../client';
import { TargetEnvironment } from '../../types';
import { createAPIUserAndKey } from '../provision';

describe('createAPIUserAndKey', () => {
  it('should create an API user and key', async () => {
    const mockUserId = 'mockUserId';
    const mockSubScriptionKey = 'mockSubscriptionKey';
    const mockAPIKey = 'mockAPIKey';
    const mockCallbackHost = 'http://localhost';
    const mockFetchUserResult = {
      targetEnvironment: TargetEnvironment.Sandbox,
      providerCallbackHost: 'localhost',
    };
    const mockCreateAPIKeyResult = { apiKey: mockAPIKey };

    vi.spyOn(uuid, 'v4').mockReturnValueOnce(mockUserId);
    nock(BASE_URL)
      .post('/v1_0/apiuser')
      .reply(HttpStatusCode.Created, '')
      .get(`/v1_0/apiuser/${mockUserId}`)
      .reply(HttpStatusCode.Created, mockFetchUserResult)
      .post(`/v1_0/apiuser/${mockUserId}/apikey`)
      .reply(HttpStatusCode.Created, mockCreateAPIKeyResult);

    const result = await createAPIUserAndKey({
      providerCallbackHost: mockCallbackHost,
      subscriptionKey: mockSubScriptionKey,
    });
    expect(result).toEqual({
      userId: mockUserId,
      apiKey: mockAPIKey,
      targetEnvironment: TargetEnvironment.Sandbox,
      subscriptionKey: mockSubScriptionKey,
      providerCallbackHost: mockCallbackHost,
    });
  });
});
