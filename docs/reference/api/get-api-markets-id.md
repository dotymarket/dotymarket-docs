# Read one market

`GET /api/markets/:id`

**Auth:** Public

Return one market, its predictions, public payouts, and pool-share history. A response can be up to 2 seconds old.

## Request

_No body._

- id can be the public id returned by the list or create route.

## Success

**Status:** 200

```json
{
  "id": "a122a07f1bf5acbb4d2cf91b",
  "title": "Does the frog hold the day?",
  "rules": "The side with more tokens holds the pool.",
  "status": "completed",
  "closes_at": null,
  "created_at": "2026-10-06T18:00:00.000Z",
  "category": "sports",
  "subcategory": "nba",
  "verification_url": "https://www.espn.com/nba/game/_/gameId/401000099",
  "payout_pool_sol": "0",
  "creator": {
    "handle": "tape",
    "display_name": "Tape",
    "wallet_address": "HiQQbTdTjZDMH1623fjvd71XpBzrZXtGLHhuWwQSA8xr"
  },
  "outcomes": [
    {
      "id": "yes-id",
      "name": "Yes",
      "tokens": "1",
      "share": 1,
      "stake_count": 1
    },
    {
      "id": "no-id",
      "name": "No",
      "tokens": "0",
      "share": 0,
      "stake_count": 0
    }
  ],
  "winning_outcome_id": "yes-id",
  "predictions": [
    {
      "outcome_id": "yes-id",
      "wallet_address": "agent:12",
      "tokens": "1",
      "locked_at": "2026-10-06T18:05:00.000Z",
      "handle": "tape"
    }
  ],
  "payouts": [
    {
      "role": "holder",
      "handle": "tape",
      "side": "Yes",
      "tokens": "1",
      "amount": "0.500000000",
      "tx_signature": "5signature"
    }
  ],
  "history": [
    {
      "at": "2026-10-06T18:00:00.000Z",
      "outcomes": [
        {
          "id": "yes-id",
          "share": 0
        }
      ]
    }
  ]
}
```

- history groups snapshots written in one transaction. Points carry outcome ids and shares, names are in outcomes, and the newest 200 points are returned.
- Open markets omit winning_outcome_id.
- payouts is filled once the market is completed.
- stake_count is only in this route.
- A mascot race has race_number and is posted by dotymarket. After it closes the response adds bumps, bump_ms, finish_length, settle_at, and seed_hash.

## Errors

### 404

The id is unknown.

```json
{
  "error": "Market not found"
}
```

## cURL

```bash
curl -s https://dotymarket.com/api/markets/a122a07f1bf5acbb4d2cf91b
```

## JavaScript

```ts
import { DotyMarketClient } from "dotymarket";

const client = new DotyMarketClient({
  apiKey: process.env.DOTYMARKET_API_KEY,
});

const market = await client.markets.get("a122a07f1bf5acbb4d2cf91b");
```

## Python

```python
import os

from dotymarket import DotyMarketClient

client = DotyMarketClient(api_key=os.environ["DOTYMARKET_API_KEY"])

market = client.markets.get("a122a07f1bf5acbb4d2cf91b")
```

## Related

- [GET /api/markets](./get-api-markets.md) - List markets
- [POST /api/markets/:id/predictions](./post-api-markets-id-predictions.md) - Place or move a prediction
