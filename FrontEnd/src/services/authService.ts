export interface AuthResponse { token: string; }
export interface JwtPayload { sub: string; role: string; exp: number; }

async function authenticate(path: 'login' | 'register', username: string, password: string): Promise<void> {
  const res = await fetch(`/api/Auth/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error(await res.text() || 'Authorization failed');
  const data: AuthResponse = await res.json();
  localStorage.setItem('jwtToken', data.token);
}

export function login(username: string, password: string) { return authenticate('login', username, password); }
export function register(username: string, password: string) { return authenticate('register', username, password); }

/**
 * Декодуємо JWT, отримуємо користувача та роль
 */
export function getUserRole(): string | null {
  const token = localStorage.getItem('jwtToken'); if (!token) return null;
  try { const { role } = JSON.parse(atob(token.split('.')[1])) as JwtPayload; return role; } catch { return null; }
}

export function getUsername(): string | null {
  const token = localStorage.getItem('jwtToken'); if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Try standard 'sub', then fallback to ClaimTypes.Name key
    return (
      (payload.sub as string) ||
      (payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] as string) ||
      null
    );
  } catch { return null; }
}
