import { APIRequestContext, APIResponse } from "@playwright/test";

// Which centralized auth mechanism (if any) a request should apply.
// Explicit opt-in per request, since a given endpoint typically expects
// exactly one auth scheme - sending both at once can confuse some APIs.
export type ApiAuthType = "apiKey" | "bearer" | "none";

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  auth?: ApiAuthType;
  // Overrides for the centralized API_KEY / BEARER_TOKEN env vars, per request.
  apiKey?: string;
  bearerToken?: string;
}

/**
 * Reusable wrapper around Playwright's native APIRequestContext.
 * Centralizes header/auth construction so API tests stay declarative.
 */
export class ApiUtilities {
  constructor(private readonly request: APIRequestContext) {
    this.request = request;
  }

  async get(url: string, options: ApiRequestOptions = {}): Promise<APIResponse> {
    return this.request.get(url, {
      headers: this.buildHeaders(options),
      params: options.params,
    });
  }

  async post(url: string, options: ApiRequestOptions = {}): Promise<APIResponse> {
    return this.request.post(url, {
      headers: this.buildHeaders(options),
      params: options.params,
      data: options.data,
    });
  }

  async put(url: string, options: ApiRequestOptions = {}): Promise<APIResponse> {
    return this.request.put(url, {
      headers: this.buildHeaders(options),
      params: options.params,
      data: options.data,
    });
  }

  async delete(url: string, options: ApiRequestOptions = {}): Promise<APIResponse> {
    return this.request.delete(url, {
      headers: this.buildHeaders(options),
      params: options.params,
    });
  }

  // Applies at most one auth scheme per request (opt-in via `options.auth`),
  // falling back to the centralized API_KEY / BEARER_TOKEN env vars when a
  // request doesn't supply its own override, so credentials never need to be
  // hardcoded in tests.
  private buildHeaders(options: ApiRequestOptions): Record<string, string> {
    const headers: Record<string, string> = { ...options.headers };

    if (options.auth === "apiKey") {
      const apiKey = options.apiKey ?? process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API_KEY is not defined in the environment variables.");
      }
      headers["x-api-key"] = apiKey;
    } else if (options.auth === "bearer") {
      const bearerToken = options.bearerToken ?? process.env.BEARER_TOKEN;
      if (!bearerToken) {
        throw new Error("BEARER_TOKEN is not defined in the environment variables.");
      }
      headers["Authorization"] = `Bearer ${bearerToken}`;
    }

    return headers;
  }
}

export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined in the environment variables.`);
  }
  return value;
}
