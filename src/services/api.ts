const BASE_URL = 'https://v2.api.noroff.dev';

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('holidaze_user');
    return raw ? JSON.parse(raw).accessToken : null;
  } catch {
    return null;
  }
}

function buildHeaders(auth = false): HeadersInit {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': import.meta.env.VITE_API_KEY ?? '',
  };
  if (auth) {
    const t = getToken();
    if (t) h['Authorization'] = `Bearer ${t}`;
  }
  return h;
}

async function handle<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const json = await res.json();
  if (!res.ok)
    throw new Error(json?.errors?.[0]?.message ?? 'Something went wrong');
  return json as T;
}

export const api = {
  get: <T>(path: string, auth = false) =>
    fetch(`${BASE_URL}${path}`, { headers: buildHeaders(auth) }).then((r) =>
      handle<T>(r),
    ),
  post: <T>(path: string, body: unknown, auth = false) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(auth),
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  put: <T>(path: string, body: unknown, auth = true) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(auth),
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  delete: (path: string, auth = true) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: buildHeaders(auth),
    }).then((r) => handle<void>(r)),
};
