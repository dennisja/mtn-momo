# mtn-momo

A collection of utils to interact with the mtn momo api

## Installation

> Note: package not published yet and the name is subject to change

- With yarn

```bash
yarn add @dennisja/mtn-momo
```

- With npm

```bash
npm install @dennisja/mtn-momo
```

- With pnpm

```bash
pnpm install @dennisja/mtn-momo
```

## Functionalities

### User provisioning

> This implements api user and key management as explained [here](https://momodeveloper.mtn.com/api-documentation/api-description/)

This is needed when developing to get the credentials you will use when getting the access token to access any service. You will need to first obtain a subscription key by subscribing to any of the [mtm momo products](https://momodeveloper.mtn.com/products). Once you have subscribed and logged in, you will find the primary key of the product you want to use under your [developer profile](https://momodeveloper.mtn.com/developer). Its the primary key. Below are the apis you can use for user provisioning.

- `createAPIUserAndKey` - This returns you all the details you need to provision a user

**Usage**

```js
import { createAPIUserAndKey } from '@dennisja/mtn-momo';

const subscriptionKey =
  'the subscription key of the product as explained above';

const data = await createAPIUserAndKey({
  providerCallbackHost: 'http://localhost',
  subscriptionKey,
});
```

> The `createAPIUserAndKey` is all you need to generate user credentials. Its is just a facade around, `createProvisioningClient` that creates a client you will use to make provisioning requests, `createAPIUser` that creates an api user and returns the id of the user, `createAPIKey` that creates an apiKey and returns it and `fetchAPIUser` that returns the `targetEnvironment` and the `providerCallbackHost` as stored by mtn. We recommend that you `createAPIUserAndKey` and only use the other low level functions if you find a use case it doesn't cover

> We don't have versioning exposed because, user provisioning has only one version (v1) unlike other apis that have multiple versions

### Creating tokens

- **Access token**
  This is a token you can use to access other endpoints of the API. You can create an access token for each product by using the `createAccessToken` method

```js
import { createAccessToken } from '@dennisja/mtn-momo';

const accessTokenDetails = createAccessToken({
  userId: 'the api user id',
  apiKey: 'the api key ',
  targetEnvironment: 'product or sandbox',
  subscriptionKey: 'the primary key of the product',
  providerCallbackHost: 'the url where you want confirmations redirected to',
}); // returns {accessToken: '',tokenType: 'access_token', expiresIn: 3600 }
```
