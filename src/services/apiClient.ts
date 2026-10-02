const API_BASE_URL = 'http://localhost:8080/api/v1';
const TOKEN_KEY = 'medicore_jwt_token';

let cachedToken: string | null = null;
let loginPromise: Promise<string | null> | null = null;

export const apiClient = {
  getToken(): string | null {
    if (cachedToken) return cachedToken;
    try {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        cachedToken = stored;
        return stored;
      }
    } catch {
      // Ignore localStorage errors
    }
    return null;
  },

  setToken(token: string): void {
    cachedToken = token;
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Ignore localStorage errors
    }
  },

  clearToken(): void {
    cachedToken = null;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Ignore
    }
  },

  /**
   * Automatically acquire a JWT token if none exists by using demo admin credentials
   */
  async ensureToken(): Promise<string | null> {
    const existing = this.getToken();
    if (existing) return existing;

    if (loginPromise) return loginPromise;

    loginPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'admin@medicore.com',
            password: 'admin123',
          }),
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        const token = data?.data?.token || data?.data?.accessToken;
        if (token) {
          this.setToken(token);
          return token;
        }
      } catch (err) {
        console.warn('Backend server not reachable for auto-token:', err);
      } finally {
        loginPromise = null;
      }
      return null;
    })();

    return loginPromise;
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.ensureToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: { message?: string } | null = null;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // Not JSON
      }
      throw new Error(errorJson?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  },

  async get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const qs = searchParams.toString();
      if (qs) {
        url += (url.includes('?') ? '&' : '?') + qs;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};
