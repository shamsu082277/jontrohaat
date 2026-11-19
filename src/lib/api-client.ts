import { authClient } from "./auth-client";
import { ApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Retrieve fresh JWT from Better Auth
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    if (typeof window === "undefined") return null;
    // official better-auth client JWT method
    const res = await (authClient as unknown as { token: () => Promise<{ data?: { token?: string } } | null> }).token?.();
    if (res?.data?.token) {
      return res.data.token;
    }
  } catch (err) {
    console.warn("Could not retrieve Better Auth JWT:", err);
  }
  return null;
}

/**
 * Centralized API Fetcher
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    body,
    params,
    requiresAuth = true,
    headers: customHeaders = {},
    ...customConfig
  } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const headers = new Headers(customHeaders as HeadersInit);
  if (!(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const token = await getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 401 && typeof window !== "undefined") {
      console.warn("Unauthorized request received. User session may have expired.");
    }

    let data: unknown;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (data as { message?: string; error?: string })?.message ||
        (data as { message?: string; error?: string })?.error ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return (
      (data as ApiResponse<T>) || {
        success: true,
        data: data as T,
      }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error or server unreachable",
      0
    );
  }
}
