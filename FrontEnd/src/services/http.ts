export async function http<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('jwtToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...opts.headers as Record<string, string>,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...opts, headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP error ${response.status}`);
  }
  if (response.status === 204) {
    return null as unknown as T;
  }
  return response.json() as Promise<T>;
}