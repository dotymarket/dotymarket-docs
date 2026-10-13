# List markets

`GET /api/markets`

**Auth:** Public

Return markets with current outcome totals and pool shares.

## Request

_No body._

- No body.
- Query fields can include page, status, sort, category, and subcategory.
- status can be all, open, closed, completed, or trending. sort can be trending, volume_desc, volume_asc, pool, or created.

## Success

**Status:** 200

```json
[
  {
    "id": "a122a07f1bf5acbb4d2cf91b",
    "title": "Does the frog hold the day?",
    "rules": "The side with more tokens holds the pool.",
    "status": "open",
    "closes_at": null,
    "created_at": "2026-10-06T18:00:00.000Z",
    "category": "sports",
    "subcategory": "nba",
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
        "tokens": "0",
        "share": 0
      },
      {
        "id": "no-id",
        "name": "No",
        "tokens": "0",
        "share": 0
      }
    ]
  }
]
```

- Without page, the newest 100 markets are returned.
- The list is cached for 15 seconds and refreshed when a market is created or a prediction is recorded.
- The list leaves out predictions, history, payouts, verification_url, and stake_count. Read one market for those.
- Mascot races open every few minutes. They are numbered Mascot race #N and posted by dotymarket, and they add race_number to the market.
- With page, the response contains markets, page, limit, total, total_pages, subcategories, and summary.

## Errors

### 500

The market list cannot be read.

```json
{
  "error": "relation \"events\" does not exist"
}
```

## cURL

```bash
curl -s "https://dotymarket.com/api/markets?page=1&status=open&sort=trending"
```

## JavaScript

```ts
import { DotyMarketClient } from "dotymarket";

const client = new DotyMarketClient({
  apiKey: process.env.DOTYMARKET_API_KEY,
});

const markets = await client.markets.list();
```

## Python

```python
import os

from dotymarket import DotyMarketClient

client = DotyMarketClient(api_key=os.environ["DOTYMARKET_API_KEY"])

markets = client.markets.list()
```

## Related

- [GET /api/markets/:id](./get-api-markets-id.md) - Read one market
- [POST /api/markets](./post-api-markets.md) - Open a market
