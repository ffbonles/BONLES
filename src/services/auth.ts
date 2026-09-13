import { store } from './store';

export const SUPERADMIN_CREDENTIALS = {
  USERNAME: 'ffbonles@gmail.com',
  PASSWORD: 'ffbonles1607',
  ROLE: 'Super Administrator',
  NAME: 'Super Administrator Bonles',
};

export const ADMIN_CREDENTIALS = {
  USERNAME: 'admin@bonlesfood.com',
  ALT_USERNAME: 'admin',
  PASSWORD: 'adminbonles',
  ROLE: 'Administrator',
  NAME: 'Administrator Bonles',
};

const AUTH_STORAGE_KEY = 'bonles_superadmin_session_v1';

export interface AdminSession {
  email: string;
  role: string;
  name: string;
  loggedInAt: string;
  token: string;
}

class AuthService {
  private currentSession: AdminSession | null = null;

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    try {
      const data = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (data) {
        this.currentSession = JSON.parse(data) as AdminSession;
      }
    } catch {
      this.currentSession = null;
    }
  }

  isAuthenticated(): boolean {
    if (!this.currentSession) {
      this.restoreSession();
    }
    return !!this.currentSession;
  }

  isSuperAdmin(): boolean {
    const session = this.getSession();
    return !!session && session.role === 'Super Administrator';
  }

  getSession(): AdminSession | null {
    if (!this.currentSession) {
      this.restoreSession();
    }
    return this.currentSession;
  }

  login(usernameOrEmail: string, password: string, rememberMe = true): { success: boolean; message: string } {
    const cleanUsername = (usernameOrEmail || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Check Super Administrator
    const isSuper = (cleanUsername === SUPERADMIN_CREDENTIALS.USERNAME.toLowerCase()) && (cleanPassword === SUPERADMIN_CREDENTIALS.PASSWORD);

    // Check Standard Administrator
    const isAdmin = (cleanUsername === ADMIN_CREDENTIALS.USERNAME.toLowerCase() || cleanUsername === ADMIN_CREDENTIALS.ALT_USERNAME) && (cleanPassword === ADMIN_CREDENTIALS.PASSWORD);

    if (isSuper || isAdmin) {
      const isSuperUser = isSuper;
      const session: AdminSession = {
        email: isSuperUser ? SUPERADMIN_CREDENTIALS.USERNAME : ADMIN_CREDENTIALS.USERNAME,
        role: isSuperUser ? SUPERADMIN_CREDENTIALS.ROLE : ADMIN_CREDENTIALS.ROLE,
        name: isSuperUser ? SUPERADMIN_CREDENTIALS.NAME : ADMIN_CREDENTIALS.NAME,
        loggedInAt: new Date().toISOString(),
        token: `bnls_adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      };

      this.currentSession = session;
      const sessionJson = JSON.stringify(session);
      
      sessionStorage.setItem(AUTH_STORAGE_KEY, sessionJson);
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, sessionJson);
      }

      // Log successful login audit trail
      store.addLog(
        'AUDIT',
        isSuperUser ? 'SUPERADMIN_LOGIN' : 'ADMIN_LOGIN',
        session.email,
        session.token,
        `Autentikasi ${session.role} (${session.name}) berhasil. Hak akses edit penuh katalog, redaksi, dan iklan diberikan.`,
        'SUCCESS'
      );

      return {
        success: true,
        message: `Login ${session.role} berhasil! Mengalihkan ke panel kontrol...`,
      };
    }

    // Log failed login attempt
    store.addLog(
      'AUDIT',
      'ADMIN_LOGIN_FAILED',
      cleanUsername || 'UNKNOWN',
      'N/A',
      `Percobaan login ditolak: kredensial tidak cocok untuk user '${usernameOrEmail}'`,
      'FAILED'
    );

    return {
      success: false,
      message: 'Username / Email atau Password tidak valid. Akses ditolak.',
    };
  }

  logout(): void {
    const user = this.currentSession?.email || 'ADMIN';
    this.currentSession = null;
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);

    store.addLog(
      'AUDIT',
      'ADMIN_LOGOUT',
      user,
      'N/A',
      'Sesi admin diakhiri secara manual.',
      'SUCCESS'
    );
  }
}

export const authService = new AuthService();
