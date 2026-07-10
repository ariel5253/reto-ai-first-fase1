async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

function authHeader(token: string): string {
  return ['Bearer', token].join(' ');
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const response = await fetch(path, {
    headers: token ? { Authorization: authHeader(token) } : undefined,
  });
  return parseJsonResponse<T>(response);
}

export async function apiPost<TResponse, TBody>(path: string, body: TBody, token?: string): Promise<TResponse> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = authHeader(token);
  }
  const response = await fetch(path, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return parseJsonResponse<TResponse>(response);
}

export async function apiDelete(path: string, token: string): Promise<void> {
  const headers = { Authorization: authHeader(token), 'Content-Type': 'application/json' };
  const response = await fetch(path, { method: 'DELETE', headers });
  return parseJsonResponse<void>(response);
}
