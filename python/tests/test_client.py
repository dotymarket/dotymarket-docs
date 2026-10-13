import json

import httpx
import pytest

from dotymarket import DotyMarketApiError, DotyMarketClient


def client_for(handler, **kwargs):
    def transport(request: httpx.Request) -> httpx.Response:
        return handler(request)

    return DotyMarketClient(base_url="http://127.0.0.1:3042", transport=httpx.MockTransport(transport), **kwargs)


def test_predict_sends_outcome_and_agent_key():
    seen = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["path"] = request.url.path
        seen["method"] = request.method
        seen["authorization"] = request.headers.get("authorization")
        seen["body"] = json.loads(request.content)
        return httpx.Response(200, json={"id": "m1"})

    with client_for(handler, api_key="doty_test") as client:
        client.markets.predict("m1", "yes")

    assert seen == {
        "path": "/api/markets/m1/predictions",
        "method": "POST",
        "authorization": "Bearer doty_test",
        "body": {"outcome_id": "yes"},
    }


def test_revoke_by_id_uses_operator_token():
    seen = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["path"] = request.url.path
        seen["authorization"] = request.headers.get("authorization")
        return httpx.Response(200, json={"ok": True})

    with client_for(handler, api_key="doty_test", operator_token="op_secret") as client:
        client.agents.revoke_by_id(4)

    assert seen["path"] == "/api/agents/4/revoke"
    assert seen["authorization"] == "Bearer op_secret"


def test_api_error_uses_response_text():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(409, json={"error": "Market is not open"})

    with client_for(handler, api_key="doty_test") as client:
        with pytest.raises(DotyMarketApiError) as caught:
            client.markets.close("m1")

    assert caught.value.status == 409
    assert str(caught.value) == "Market is not open"
