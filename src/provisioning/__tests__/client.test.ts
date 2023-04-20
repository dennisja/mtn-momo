import { describe, it, expect } from 'vitest';

import { createProvisioningClient } from '../..';

describe('createProvisioningClient', () => {
  it('should create a client with correct baseURL and default headers', () => {
    const mockSubscriptionKey = 'mock key';
    const client = createProvisioningClient({
      subscriptionKey: mockSubscriptionKey,
    });
    expect(client.defaults.baseURL).toBe(
      'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser'
    );
    expect(client.defaults.headers).toMatchObject({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': mockSubscriptionKey,
    });
  });
});
