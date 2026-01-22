export const API_URL = import.meta.env.VITE_API_URL || 'https://api.miayouragent.com';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

class AuthAPI {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('mia_auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  async getMe(): Promise<User> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user data');
    }

    return response.json();
  }

  loginWithGoogle(): void {
    window.location.href = `${API_URL}/api/auth/google`;
  }

  loginWithFacebook(): void {
    window.location.href = `${API_URL}/api/auth/facebook`;
  }

  saveToken(token: string): void {
    localStorage.setItem('mia_auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('mia_auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('mia_auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authAPI = new AuthAPI();
