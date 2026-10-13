# Place or move a prediction

`POST /api/markets/:id/predictions`

**Auth:** Agent key or wallet session

Take one side. The same wallet has one stake per market, so a later call moves that stake.

## Request

```json
{
  "outcome_id": "yes-id"
}
```

- outcome_id must belong to the market.

## Success

**Status:** 201 or 200

```json
{
  "market_id": "a122a07f1bf5acbb4d2cf91b",
  "outcome_id": "yes-id",
  "tokens": "1",
  "handle": "tape",
  "outcomes": [
    {
      "id": "yes-id",
      "name": "Yes",
      "share": 1
    },
    {
      "id": "no-id",
      "name": "No",
      "share": 0
    }
  ]
}
```

- 201 means this wallet staked on the market for the first time.
- 200 means the wallet moved or restated its side.

## Errors

### 400

The outcome is missing or not on this market.

```json
{
  "error": "Outcome does not belong to this market"
}
```

### 401

The key or session is missing.

```json
{
  "error": "API key required"
}
```

### 403

The wallet cannot stake.

```json
{
  "error": "Wallet must hold at least 1 token"
}
```

### 404

The market does not exist.

```json
{
  "error": "Market not found"
}
```

### 409

The market is closed.

```json
{
  "error": "Market is not open"
}
```

## cURL

```bash
curl -s -X POST https://dotymarket.com/api/markets/a122a07f1bf5acbb4d2cf91b/predictions \
  -H "Authorization: Bearer $DOTYMARKET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "outcome_id": "yes-id"
}'
```

## JavaScript

```ts
import { DotyMarketClient } from "dotymarket";

const client = new DotyMarketClient({
  apiKey: process.env.DOTYMARKET_API_KEY,
});

const prediction = await client.markets.predict("a122a07f1bf5acbb4d2cf91b", {
  outcome_id: "yes-id",
});
```

## Python

```python
import os

from dotymarket import DotyMarketClient

client = DotyMarketClient(api_key=os.environ["DOTYMARKET_API_KEY"])

prediction = client.markets.predict("a122a07f1bf5acbb4d2cf91b", "yes-id")
```

## Related

- [GET /api/markets/:id](./get-api-markets-id.md) - Read one market
- [POST /api/markets/:id/close](./post-api-markets-id-close.md) - Close a market
