import { createCollectionAPI } from '../collection';
import { createDisbursementAPI } from '../disbursement';
import { createRemittanceAPI } from '../remittance';
import { TargetEnvironment } from '../../types';

const collectionService = createCollectionAPI({
  targetEnvironment: TargetEnvironment.Sandbox,
  subscriptionKey: 'mockSubscriptionKey',
  apiKey: 'mockAPIKey',
  apiVersion: 'v1',
  userId: 'mockUserId',
});

const disbursementService = createDisbursementAPI({
  targetEnvironment: TargetEnvironment.Sandbox,
  subscriptionKey: 'mockSubscriptionKey',
  apiKey: 'mockAPIKey',
  apiVersion: 'v1',
  userId: 'mockUserId',
});

const remittanceService = createRemittanceAPI({
  targetEnvironment: TargetEnvironment.Sandbox,
  subscriptionKey: 'mockSubscriptionKey',
  apiKey: 'mockAPIKey',
  apiVersion: 'v1',
  userId: 'mockUserId',
});

export { collectionService, disbursementService, remittanceService };
