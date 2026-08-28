const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:8080';

let accessToken: string | null = null;
let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function setUnauthorizedHandler(handler: (() => void | Promise<void>) | null): void {
  unauthorizedHandler = handler;
}

type ApiRequestOptions = RequestInit & { auth?: boolean };

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = true, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers);
  if (requestOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth && accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...requestOptions, headers });
  if (response.status === 401 && auth && unauthorizedHandler) {
    await unauthorizedHandler();
  }

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;
    try {
      const problem = (await response.json()) as { detail?: string; title?: string };
      message = problem.detail || problem.title || message;
    } catch {
      // Keep the generic HTTP message when the body is not JSON.
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
