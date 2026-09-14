import { gasSync } from './gasSyncService';

const AUTH_STORAGE_KEY = 'bonles_admin_session_v2';
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export interface AdminSession {
  email: string;
  role: string;
  name: string;
  loggedInAt: string;
  token: string;
}

export const ADMIN_LABELS = {
  defaultName: 'Administrator Bonles',
  defaultRole: 'Administrator',
};

function safeStorage(storage: Storage): Storage | null {
  try {
    const probe = '__bonles_auth_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

class AuthService {
  private currentSession: AdminSession | null = null;

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    try {
      const sources: Storage[] = [];
      if (typeof sessionStorage !== 'undefined') {
        const s = safeStorage(sessionStorage);
        if (s) sources.push(s);
      }
      if (typeof localStorage !== 'undefined') {
        const s = safeStorage(localStorage);
        if (s) sources.push(s);
      }

      for (const storage of sources) {
        const raw = storage.getItem(AUTH_STORAGE_KEY);
        if (!raw) continue;
        const parsed = JSON.parse(raw) as AdminSession;
        if (!parsed?.token || !parsed?.loggedInAt || !parsed?.email) continue;
        if (Date.now() - new Date(parsed.loggedInAt).getTime() > SESSION_MAX_AGE_MS) {
          storage.removeItem(AUTH_STORAGE_KEY);
          continue;
        }
        this.currentSession = parsed;
        gasSync.setAuthToken(parsed.token);
        return;
      }
    } catch {
      this.currentSession = null;
      gasSync.setAuthToken(null);
    }
  }

  isAuthenticated(): boolean {
    if (!this.currentSession) this.restoreSession();
    return !!this.currentSession;
  }

  isSuperAdmin(): boolean {
    return this.getSession()?.role === 'Super Administrator';
  }

  getSession(): AdminSession | null {
    if (!this.currentSession) this.restoreSession();
    return this.currentSession;
  }

  async login(usernameOrEmail: string, password: string, rememberMe = false): Promise<{ success: boolean; message: string }> {
    const username = usernameOrEmail.trim();
    if (!username || !password) {
      return { success: false, message: 'Username/email dan password wajib diisi.' };
    }

    const result = await gasSync.loginAdmin(username, password);
    if (!result.success || !result.data) {
      return { success: false, message: result.message || 'Autentikasi gagal.' };
    }

    const session: AdminSession = {
      email: String(result.data.email || username),
      role: String(result.data.role || ADMIN_LABELS.defaultRole),
      name: String(result.data.name || ADMIN_LABELS.defaultName),
      loggedInAt: new Date().toISOString(),
      token: String(result.data.token),
    };

    this.currentSession = session;
    gasSync.setAuthToken(session.token);
    const serialized = JSON.stringify(session);

    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
      if (rememberMe) localStorage.setItem(AUTH_STORAGE_KEY, serialized);
      else localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Session remains usable in memory even if browser storage is unavailable.
    }

    return { success: true, message: `Login ${session.role} berhasil.` };
  }

  logout(): void {
    const token = this.currentSession?.token;
    this.currentSession = null;
    gasSync.setAuthToken(null);

    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage failures during logout.
    }

    if (token) {
      void gasSync.logoutAdmin(token).catch(() => undefined);
    }
  }
}

export const authService = new AuthService();
