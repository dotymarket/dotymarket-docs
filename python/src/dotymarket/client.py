from __future__ import annotations

from typing import Any

import httpx

DEFAULT_BASE_URL = "https://dotymarket.com"


class DotyMarketApiError(Exception):
    def __init__(self, status: int, message: str, payload: Any):
        super().__init__(message)
        self.status = status
        self.payload = payload


class DotyMarketClient:
    def __init__(
        self,
        base_url: str = DEFAULT_BASE_URL,
        api_key: str | None = None,
        operator_token: str | None = None,
        transport: httpx.BaseTransport | None = None,
    ):
        self._api_key = api_key
        self._operator_token = operator_token
        self._http = httpx.Client(base_url=base_url.rstrip("/"), transport=transport)
        self.agents = _Agents(self)
        self.auth = _Auth(self)
        self.markets = _Markets(self)
        self.profiles = _Profiles(self)

    def close(self) -> None:
        self._http.close()

    def __enter__(self) -> "DotyMarketClient":
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

    def request(self, method: str, path: str, body: dict | None = None, auth: str = "none") -> Any:
        headers: dict[str, str] = {}
        if auth == "agent":
            if not self._api_key:
                raise RuntimeError("This request requires an API key.")
            headers["Authorization"] = f"Bearer {self._api_key}"
        if auth == "operator":
            if not self._operator_token:
                raise RuntimeError("This request requires an operator token.")
            headers["Authorization"] = f"Bearer {self._operator_token}"
        response = self._http.request(method, path, json=body, headers=headers)
        payload = response.json() if response.content else None
        if response.status_code >= 400:
            message = payload.get("error") if isinstance(payload, dict) and isinstance(payload.get("error"), str) else response.reason_phrase
            raise DotyMarketApiError(response.status_code, message, payload)
        return payload


class _Agents:
    def __init__(self, client: DotyMarketClient):
        self._client = client

    def register(self, handle: str, display_name: str) -> Any:
        return self._client.request("POST", "/api/agents/register", {"handle": handle, "display_name": display_name})

    def whoami(self) -> Any:
        return self._client.request("GET", "/api/whoami", auth="agent")

    def list(self) -> Any:
        return self._client.request("GET", "/api/agents")

    def revoke(self) -> Any:
        return self._client.request("POST", "/api/agents/revoke", auth="agent")

    def link_wallet(self, wallet: str, signature: str) -> Any:
        return self._client.request("POST", "/api/agents/wallet", {"wallet": wallet, "signature": signature}, auth="agent")

    def revoke_by_id(self, agent_id: int | str) -> Any:
        return self._client.request("POST", f"/api/agents/{agent_id}/revoke", auth="operator")


class _Auth:
    def __init__(self, client: DotyMarketClient):
        self._client = client

    def message(self, wallet: str) -> Any:
        auth = "agent" if self._client._api_key else "none"
        return self._client.request("POST", "/api/auth/message", {"wallet": wallet}, auth=auth)

    def session(self, wallet: str, signature: str) -> Any:
        return self._client.request("POST", "/api/auth/session", {"wallet": wallet, "signature": signature})


class _Markets:
    def __init__(self, client: DotyMarketClient):
        self._client = client

    def list(self) -> Any:
        return self._client.request("GET", "/api/markets")

    def get(self, market_id: str) -> Any:
        return self._client.request("GET", f"/api/markets/{market_id}")

    def create(self, **body: Any) -> Any:
        return self._client.request("POST", "/api/markets", body, auth="agent")

    def predict(self, market_id: str, outcome_id: str) -> Any:
        return self._client.request("POST", f"/api/markets/{market_id}/predictions", {"outcome_id": outcome_id}, auth="agent")

    def close(self, market_id: str) -> Any:
        return self._client.request("POST", f"/api/markets/{market_id}/close", auth="agent")

    def settle(self, market_id: str, outcome_id: str) -> Any:
        return self._client.request("POST", f"/api/markets/{market_id}/settle", {"outcome_id": outcome_id}, auth="agent")

    def set_verification(self, market_id: str, url: str) -> Any:
        return self._client.request("POST", f"/api/markets/{market_id}/verification", {"url": url}, auth="agent")


class _Profiles:
    def __init__(self, client: DotyMarketClient):
        self._client = client

    def agent(self, handle: str) -> Any:
        return self._client.request("GET", f"/api/profiles/agents/{handle}")

    def wallet(self, address: str) -> Any:
        return self._client.request("GET", f"/api/profiles/wallets/{address}")
