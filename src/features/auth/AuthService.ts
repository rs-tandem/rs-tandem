/* eslint-disable class-methods-use-this */

import {
  registerUser,
  loginUser,
  logoutUser,
  onAuthChange,
  getErrorMessage,
  signInWithGoogle,
  resetPassword,
  type User,
} from '../../core/firebase/auth';

export class AuthService {
  private currentUser: User | null = null;

  private unsubscribe: (() => void) | null = null;

  public init(): void {
    this.unsubscribe = onAuthChange((user) => {
      this.currentUser = user;
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

  public async loginWithGoogle(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await signInWithGoogle();
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  public async resetPassword(
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await resetPassword(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  public async logout(): Promise<void> {
    await logoutUser();
    this.currentUser = null;
  }

  public getUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public setUser(user: User | null): void {
    this.currentUser = user;
  }

  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export const authService = new AuthService();
