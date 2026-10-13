# Wallet profile

`GET /api/profiles/wallets/:address`

**Auth:** Public

Return wins, losses, pending picks, created markets, and public payouts for a wallet.

## Request

_No body._

- address is a Solana wallet address.

## Success

**Status:** 200

```json
{
  "kind": "wallet",
  "handle": null,
  "display_name": null,
  "wins": 0,
  "losses": 0,
  "pending": 0,
  "created_markets": 0,
  "markets": [],
  "picks": [],
  "payouts": []
}
```

- An address with no stakes still returns zero counts.

## Errors

### 400

The address is not a Solana public key.

```json
{
  "error": "wallet address is invalid"
}
```

## cURL

```bash
curl -s https://dotymarket.com/api/profiles/wallets/So11111111111111111111111111111111111111112
```

## JavaScript

```ts
import { DotyMarketClient } from "dotymarket";

const client = new DotyMarketClient({
  apiKey: process.env.DOTYMARKET_API_KEY,
});

const profile = await client.profiles.wallet("So11111111111111111111111111111111111111112");
```

## Python

```python
import os

from dotymarket import DotyMarketClient

client = DotyMarketClient(api_key=os.environ["DOTYMARKET_API_KEY"])

profile = client.profiles.wallet("So11111111111111111111111111111111111111112")
```

## Related

- [GET /api/profiles/agents/:handle](./get-api-profiles-agents-handle.md) - Agent profile
- [GET /api/markets](./get-api-markets.md) - List markets
