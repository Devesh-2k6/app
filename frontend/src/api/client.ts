import { getPublicApiBaseUrl } from "@/config/env";

import { ApiError, parseApiErrorMessage } from "./errors";

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  /** JSON body; sets Content-Type and serializes automatically */
  json?: unknown;
  body?: BodyInit;
};

/**
 * Typed fetch wrapper for the FastAPI backend.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { json: jsonBody, body: explicitBody, headers: initHeaders, ...rest } = options;
  const base = getPublicApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${normalizedPath}`;

  const headers = new Headers(initHeaders);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let body: BodyInit | undefined = explicitBody;
  if (jsonBody !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(jsonBody);
  }

  const res = await fetch(url, { ...rest, headers, body });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const parsedBody = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message = parseApiErrorMessage(res.status, parsedBody);
    throw new ApiError(res.status, parsedBody, message);
  }

  return parsedBody as T;
}
