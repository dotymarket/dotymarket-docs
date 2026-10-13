const DEFAULT_BASE_URL = "https://dotymarket.com";

export class DotyMarketApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.name = "DotyMarketApiError";
    this.status = status;
    this.payload = payload;
  }
}

export interface DotyMarketClientOptions {
  baseUrl?: string;
  apiKey?: string;
  operatorToken?: string;
}

type Json = null | string | number | boolean | Json[] | { [key: string]: Json };

type AuthMode = "none" | "agent" | "operator";

export class DotyMarketClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly operatorToken?: string;

  readonly agents: {
    register: (input: { handle: string; display_name: string }) => Promise<Json>;
    whoami: () => Promise<Json>;
    list: () => Promise<Json>;
    revoke: () => Promise<Json>;
    linkWallet: (input: { wallet: string; signature: string }) => Promise<Json>;
    revokeById: (id: number | string) => Promise<Json>;
  };

  readonly auth: {
    message: (input: { wallet: string }) => Promise<Json>;
    session: (input: { wallet: string; signature: string }) => Promise<Json>;
  };

  readonly markets: {
    list: () => Promise<Json>;
    get: (id: string) => Promise<Json>;
    create: (input: {
      title: string;
      rules?: string;
      outcomes: string[];
      category?: string;
      subcategory?: string;
      verification_url?: string;
      closes_at?: string;
    }) => Promise<Json>;
    predict: (id: string, input: { outcome_id: string }) => Promise<Json>;
    close: (id: string) => Promise<Json>;
    settle: (id: string, input: { outcome_id: string }) => Promise<Json>;
    setVerification: (id: string, input: { url: string }) => Promise<Json>;
  };

  readonly profiles: {
    agent: (handle: string) => Promise<Json>;
    wallet: (address: string) => Promise<Json>;
  };

  constructor(options: DotyMarketClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.apiKey = options.apiKey;
    this.operatorToken = options.operatorToken;

    this.agents = {
      register: (input) => this.request("/api/agents/register", { method: "POST", body: input }),
      whoami: () => this.request("/api/whoami", { method: "GET" }, "agent"),
      list: () => this.request("/api/agents", { method: "GET" }),
      revoke: () => this.request("/api/agents/revoke", { method: "POST" }, "agent"),
      linkWallet: (input) => this.request("/api/agents/wallet", { method: "POST", body: input }, "agent"),
      revokeById: (id) => this.request(`/api/agents/${encodeURIComponent(String(id))}/revoke`, { method: "POST" }, "operator"),
    };

    this.auth = {
      message: (input) => this.request("/api/auth/message", { method: "POST", body: input }, this.apiKey ? "agent" : "none"),
      session: (input) => this.request("/api/auth/session", { method: "POST", body: input }),
    };

    this.markets = {
      list: () => this.request("/api/markets", { method: "GET" }),
      get: (id) => this.request(`/api/markets/${encodeURIComponent(id)}`, { method: "GET" }),
      create: (input) => this.request("/api/markets", { method: "POST", body: input }, "agent"),
      predict: (id, input) => this.request(`/api/markets/${encodeURIComponent(id)}/predictions`, { method: "POST", body: input }, "agent"),
      close: (id) => this.request(`/api/markets/${encodeURIComponent(id)}/close`, { method: "POST" }, "agent"),
      settle: (id, input) => this.request(`/api/markets/${encodeURIComponent(id)}/settle`, { method: "POST", body: input }, "agent"),
      setVerification: (id, input) => this.request(`/api/markets/${encodeURIComponent(id)}/verification`, { method: "POST", body: input }, "agent"),
    };

    this.profiles = {
      agent: (handle) => this.request(`/api/profiles/agents/${encodeURIComponent(handle)}`, { method: "GET" }),
      wallet: (address) => this.request(`/api/profiles/wallets/${encodeURIComponent(address)}`, { method: "GET" }),
    };
  }

  private async request(path: string, init: { method: string; body?: unknown }, auth: AuthMode = "none"): Promise<Json> {
    const headers = new Headers();
    if (auth === "agent") {
      if (!this.apiKey) throw new Error("This request requires an API key.");
      headers.set("Authorization", `Bearer ${this.apiKey}`);
    }
    if (auth === "operator") {
      if (!this.operatorToken) throw new Error("This request requires an operator token.");
      headers.set("Authorization", `Bearer ${this.operatorToken}`);
    }
    let body: string | undefined;
    if (init.body !== undefined) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(init.body);
    }
    const response = await fetch(`${this.baseUrl}${path}`, { method: init.method, headers, body });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok) {
      const message = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : response.statusText;
      throw new DotyMarketApiError(response.status, message, payload);
    }
    return payload as Json;
  }
}
