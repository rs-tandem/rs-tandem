import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  updateProfile,
} from 'firebase/auth';

import { auth } from './config';

export async function registerUser(
  email: string,
  password: string,
  displayName?: string,
): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    console.log('Пользователь зарегистрирован:', user.uid);
    return user;
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw error;
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    console.log('Пользователь вошел:', user.uid);
    return user;
  } catch (error) {
    console.error('Ошибка входа:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log('Пользователь вышел');
  } catch (error) {
    console.error('Ошибка выхода:', error);
    throw error;
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const firebaseError = error as { code: string };

    switch (firebaseError.code) {
      case 'auth/email-already-in-use':
        return 'Этот email уже используется';
      case 'auth/invalid-email':
        return 'Неверный формат email';
      case 'auth/weak-password':
        return 'Слишком простой пароль (минимум 6 символов)';
      case 'auth/user-not-found':
        return 'Пользователь не найден';
      case 'auth/wrong-password':
        return 'Неверный пароль';
      case 'auth/too-many-requests':
        return 'Слишком много попыток. Попробуйте позже';
      default:
        return 'Произошла ошибка. Попробуйте снова';
    }
  }

  return 'Неизвестная ошибка';
}
