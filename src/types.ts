enum TargetEnvironment {
  Sandbox = 'sandbox',
  Production = 'production',
}

enum Product {
  Collection = 'collection',
  Disbursement = 'disbursement',
  Remittance = 'remittance',
}

type APIVersion = 'v1' | 'v2';

export { TargetEnvironment, Product };
export type { APIVersion };
