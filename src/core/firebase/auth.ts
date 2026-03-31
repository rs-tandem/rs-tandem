import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  type User,
  type UserCredential,
} from 'firebase/auth';

import { auth } from './config';

export async function registerUser(
  email: string,
  password: string,
  displayName?: string,
): Promise<User> {
  const userCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const { user } = userCredential;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  return user;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const userCredential: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const { user } = userCredential;
  return user;
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });

  const result = await signInWithPopup(auth, provider);
  const { user } = result;

  return user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

export function onAuthChange(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const firebaseError = error as { code: string };

    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'Этот email уже используется',
      'auth/invalid-email': 'Неверный формат email',
      'auth/weak-password': 'Слишком простой пароль (минимум 6 символов)',
      'auth/user-not-found': 'Пользователь не найден',
      'auth/wrong-password': 'Неверный пароль',
      'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
      'auth/popup-closed-by-user': 'Вход отменен',
      'auth/popup-blocked': 'Разрешите всплывающие окна в браузере',
      'auth/cancelled-popup-request': 'Вход отменен',
      'auth/network-request-failed': 'Ошибка сети. Проверьте интернет',
    };

    return errorMessages[firebaseError.code] || 'Произошла ошибка';
  }

  return 'Неизвестная ошибка';
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export type { User };
