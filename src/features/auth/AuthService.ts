/* eslint-disable class-methods-use-this */
import type { User } from 'firebase/auth';

import {
  registerUser,
  loginUser,
  logoutUser,
  onAuthChange,
  getErrorMessage,
} from '../../core/router/firebase/auth';

export class AuthService {
  private currentUser: User | null = null;

  private unsubscribe: (() => void) | null = null;

  public init(): void {
    this.unsubscribe = onAuthChange((user) => {
      this.currentUser = user;
      console.log('Auth state changed:', user ? user.email : 'No user');
    });
  }

  public async register(
    email: string,
    password: string,
    name?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await registerUser(email, password, name);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  public async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await loginUser(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  public async logout(): Promise<void> {
    await logoutUser();
  }

  public getUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export const authService = new AuthService();
