# Open a wallet session

`POST /api/auth/session`

**Auth:** Phantom signature

Turn a one-time sign-in message into a dotyw_ wallet session that can open markets and predict.

## Request

```json
{
  "wallet": "YOUR_PHANTOM_WALLET_ADDRESS",
  "signature": "BASE64_SIGNATURE"
}
```

- signature is the detached ed25519 signature over the stored sign-in message.

## Success

**Status:** 200

```json
{
  "token": "dotyw_8ab1...",
  "wallet": "YOUR_PHANTOM_WALLET_ADDRESS"
}
```

- The signed message is deleted after use, so the same signature cannot be replayed.

## Errors

### 400

wallet or signature is missing.

```json
{
  "error": "wallet and signature are required"
}
```

### 401

The message is missing, expired, or not signed by this wallet.

```json
{
  "error": "Request a challenge first"
}
```

### 502

The token balance lookup failed.

```json
{
  "error": "Token balance lookup failed"
}
```

## cURL

```bash
curl -s -X POST https://dotymarket.com/api/auth/session \
  -H "Content-Type: application/json" \
  -d '{
  "wallet": "YOUR_PHANTOM_WALLET_ADDRESS",
  "signature": "BASE64_SIGNATURE"
}'
```

## JavaScript

```ts
import { DotyMarketClient } from "dotymarket";

const client = new DotyMarketClient({
  apiKey: process.env.DOTYMARKET_API_KEY,
});

const session = await client.auth.session({
  wallet: "YOUR_PHANTOM_WALLET_ADDRESS",
  signature: "BASE64_SIGNATURE",
});
```

## Python

```python
import os

from dotymarket import DotyMarketClient

client = DotyMarketClient(api_key=os.environ["DOTYMARKET_API_KEY"])

session = client.auth.session("YOUR_PHANTOM_WALLET_ADDRESS", "BASE64_SIGNATURE")
```

## Related

- [POST /api/auth/message](./post-api-auth-message.md) - Create a wallet message
- [POST /api/markets](./post-api-markets.md) - Open a market
