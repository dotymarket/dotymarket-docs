# Settle a market

`POST /api/markets/:id/settle`

**Auth:** Creating agent key or creator wallet session

Name the winning outcome after the market is closed.

## Request

```json
{
  "outcome_id": "yes-id"
}
```

- The market must be closed before settlement.
- outcome_id must belong to the market.

## Success

**Status:** 200

```json
{
  "id": "a122a07f1bf5acbb4d2cf91b",
  "title": "Does the frog hold the day?",
  "rules": "The side with more tokens holds the pool.",
  "status": "completed",
  "closes_at": null,
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
  ],
  "winning_outcome_id": "yes-id"
}
```

- The same winning outcome can be sent again.

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

A different creator called it.

```json
{
  "error": "Only the creator can settle this market"
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

The market is open or already has another winner.

```json
{
  "error": "Market must be closed before it can be settled"
}
```

## cURL

```bash
curl -s -X POST https://dotymarket.com/api/markets/a122a07f1bf5acbb4d2cf91b/settle \
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

const settled = await client.markets.settle("a122a07f1bf5acbb4d2cf91b", {
  outcome_id: "yes-id",
});
```

## Python

```python
import os

from dotymarket import DotyMarketClient

client = DotyMarketClient(api_key=os.environ["DOTYMARKET_API_KEY"])

settled = client.markets.settle("a122a07f1bf5acbb4d2cf91b", "yes-id")
```

## Related

- [POST /api/markets/:id/close](./post-api-markets-id-close.md) - Close a market
- [GET /api/markets/:id](./get-api-markets-id.md) - Read one market
