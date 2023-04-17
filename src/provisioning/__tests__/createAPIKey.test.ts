import { AxiosInstance, HttpStatusCode } from 'axios';
import { describe, it, vi, expect } from 'vitest';

import { CREATE_API_KEY_UNKNOwN_ERROR, createAPIKey } from '../createAPIKey';

describe('createAPIKey', () => {
  it('should create and return API key', async () => {
    const mockAPIKey = 'mockAPIKey';
    const mockUserId = 'mockUserId';
    const mocPostMethod = vi.fn(async () => ({
      data: { apiKey: mockAPIKey },
      status: HttpStatusCode.Created,
    }));
    const result = await createAPIKey({
      userId: mockUserId,
      client: {
        post: mocPostMethod,
      } as unknown as AxiosInstance,
    });
    expect(result.apiKey).toBe(mockAPIKey);
    expect(mocPostMethod).toBeCalledWith(`${mockUserId}/apikey`);
  });

  it('should throw an error if an error occurs', async () => {
    const mockAPIKeyError = 'mockAPIKey error';
    const mocPostMethod = vi.fn(async () => {
      throw new Error(mockAPIKeyError);
    });

    const createAPIKeyFunctionCall = async () =>
      createAPIKey({
        userId: 'mockUserId',
        client: {
          post: mocPostMethod,
        } as unknown as AxiosInstance,
      });
    expect(createAPIKeyFunctionCall).rejects.toThrow(mockAPIKeyError);
  });

  it('should throw an unknown error when an unknown response is returned from the API is returned', () => {
    const mocPostMethod = vi.fn(async () => ({}));

    const createAPIKeyFunctionCall = async () =>
      createAPIKey({
        userId: 'mockUserId',
        client: {
          post: mocPostMethod,
        } as unknown as AxiosInstance,
      });

    expect(createAPIKeyFunctionCall).rejects.toThrow(
      CREATE_API_KEY_UNKNOwN_ERROR
    );
  });
});
