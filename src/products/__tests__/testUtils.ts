import { Scope } from 'nock';
import { Product } from '../../types';

const withAuth = (nockClient: Scope, product = Product.Collection) => {
  nockClient.post(`/${product}/token/`).reply(201, {
    access_token: 'mockAccessToken',
    token_type: 'mockTokenType',
    expires_in: 2000,
  });
};

export { withAuth };
