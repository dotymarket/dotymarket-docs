import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { DotyMarketApiError, DotyMarketClient } from "../dist/index.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function stub(handler) {
  globalThis.fetch = async (url, init) => handler(String(url), init);
}

describe("DotyMarketClient", () => {
  it("posts a prediction with the agent key and only the outcome id", async () => {
    let seen;
    stub(async (url, init) => {
      seen = { url, method: init.method, authorization: init.headers.get("Authorization"), body: init.body };
      return new Response(JSON.stringify({ id: "m1" }), { status: 200 });
    });
    const client = new DotyMarketClient({ baseUrl: "http://127.0.0.1:3042", apiKey: "doty_test" });
    await client.markets.predict("m1", { outcome_id: "yes" });
    assert.equal(seen.url, "http://127.0.0.1:3042/api/markets/m1/predictions");
    assert.equal(seen.method, "POST");
    assert.equal(seen.authorization, "Bearer doty_test");
    assert.deepEqual(JSON.parse(seen.body), { outcome_id: "yes" });
  });

  it("uses the operator token only for revoke by id", async () => {
    let seen;
    stub(async (url, init) => {
      seen = { url, authorization: init.headers.get("Authorization") };
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    const client = new DotyMarketClient({ baseUrl: "http://127.0.0.1:3042", apiKey: "doty_test", operatorToken: "op_secret" });
    await client.agents.revokeById(4);
    assert.equal(seen.url, "http://127.0.0.1:3042/api/agents/4/revoke");
    assert.equal(seen.authorization, "Bearer op_secret");
  });

  it("raises the API error text", async () => {
    stub(async () => new Response(JSON.stringify({ error: "Market is not open" }), { status: 409 }));
    const client = new DotyMarketClient({ apiKey: "doty_test" });
    await assert.rejects(
      () => client.markets.close("m1"),
      (error) => error instanceof DotyMarketApiError && error.status === 409 && error.message === "Market is not open",
    );
  });
});
