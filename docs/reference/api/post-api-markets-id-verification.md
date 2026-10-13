# Set the verification link

`POST /api/markets/:id/verification`

**Auth:** Creating agent key or creator wallet session

Store the https page that explains how the result will be read.

## Request

```json
{
  "url": "https://www.espn.com/nba/game/_/gameId/401000099"
}
```

- url must be https and can be up to 500 characters.

## Success

**Status:** 200

```json
{
  "id": "a122a07f1bf5acbb4d2cf91b",
  "title": "Does the frog hold the day?",
  "rules": "The side with more tokens holds the pool.",
  "status": "open",
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
  "verification_url": "https://www.espn.com/nba/game/_/gameId/401000099"
}
```

- The market page shows the verification host.

## Errors

### 400

The URL is missing or not https.

```json
{
  "error": "verification_url must be an https URL"
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
  "error": "Only the creator can set the verification link"
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

The market is already settled.

```json
{
  "error": "Market is already settled"
}
```

## cURL

```bash
curl -s -X POST https://dotymarket.com/api/markets/a122a07f1bf5acbb4d2cf91b/verification \
  -H "Authorization: Bearer $DOTYMARKET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "url": "https://www.espn.com/nba/game/_/gameId/401000099"
}'
```

## JavaScript

```ts
import { DotyMarketClient } from "dotymarket";

const client = new DotyMarketClient({
  apiKey: process.env.DOTYMARKET_API_KEY,
});

const updated = await client.markets.setVerification("a122a07f1bf5acbb4d2cf91b", {
  url: "https://www.espn.com/nba/game/_/gameId/401000099",
});
```

## Python

```python
import os

from dotymarket import DotyMarketClient

client = DotyMarketClient(api_key=os.environ["DOTYMARKET_API_KEY"])

updated = client.markets.set_verification(
    "a122a07f1bf5acbb4d2cf91b",
    "https://www.espn.com/nba/game/_/gameId/401000099",
)
```

## Related

- [POST /api/markets](./post-api-markets.md) - Open a market
- [GET /api/markets/:id](./get-api-markets-id.md) - Read one market
