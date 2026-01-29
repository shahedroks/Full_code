import type { User, AuthSession, LoginCredentials, RegisterData, AuthError } from '@/domain/auth';

/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */
export class AuthService {
  private static instance: AuthService;
  private currentSession: AuthSession | null = null;

  // Mock users database
  private users: Map<string, User & { password: string }> = new Map();

  private constructor() {
    this.seedMockUsers();
    this.loadSessionFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private seedMockUsers() {
    // Demo customer account
    this.users.set('customer@demo.com', {
      id: 'customer1',
      email: 'customer@demo.com',
      password: 'password',
      name: 'John Doe',
      role: 'customer',
      phone: '+1-555-0100',
      avatar: 'https://images.unsplash.com/photo-1683815251677-8df20f826622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwZXJzb24lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjkxNTc0Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      createdAt: new Date().toISOString(),
    });

    // Demo provider account
    this.users.set('provider@demo.com', {
      id: 'provider1',
      email: 'provider@demo.com',
      password: 'password',
      name: 'Mike Johnson',
      role: 'provider',
      phone: '+1-555-0200',
      avatar: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5MTgxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      createdAt: new Date().toISOString(),
    });
  }

  private loadSessionFromStorage() {
    const stored = localStorage.getItem('authSession');
    if (stored) {
      try {
        const session = JSON.parse(stored) as AuthSession;
        // Check if session is expired
        if (new Date(session.expiresAt) > new Date()) {
          this.currentSession = session;
        } else {
          localStorage.removeItem('authSession');
        }
      } catch (e) {
        localStorage.removeItem('authSession');
      }
    }
  }

  private saveSessionToStorage(session: AuthSession) {
    localStorage.setItem('authSession', JSON.stringify(session));
  }

  private clearSessionFromStorage() {
    localStorage.removeItem('authSession');
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ success: true; session: AuthSession } | { success: false; error: AuthError }> {
    await this.simulateNetworkDelay();

    const user = this.users.get(credentials.email);
    
    if (!user || user.password !== credentials.password) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      };
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;

    const session: AuthSession = {
      user: userWithoutPassword,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    this.currentSession = session;
    this.saveSessionToStorage(session);

    return { success: true, session };
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<{ success: true; session: AuthSession } | { success: false; error: AuthError }> {
    await this.simulateNetworkDelay();

    // Check if user already exists
    if (this.users.has(data.email)) {
      return {
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'An account with this email already exists',
        },
      };
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: data.role,
      avatar: '',
      createdAt: new Date().toISOString(),
    };

    this.users.set(data.email, newUser);

    // Auto-login after registration
    const { password, ...userWithoutPassword } = newUser;

    const session: AuthSession = {
      user: userWithoutPassword,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.currentSession = session;
    this.saveSessionToStorage(session);

    return { success: true, session };
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    this.currentSession = null;
    this.clearSessionFromStorage();
  }

  /**
   * Get current session
   */
  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }

  /**
   * Update current session
   */
  updateSession(session: AuthSession): void {
    this.currentSession = session;
    this.saveSessionToStorage(session);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  /**
   * Check if current user has specific role
   */
  hasRole(role: 'customer' | 'provider'): boolean {
    return this.currentSession?.user.role === role;
  }

  private generateToken(): string {
    return `token_${Math.random().toString(36).substring(2)}_${Date.now()}`;
  }

  private async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
  }
}