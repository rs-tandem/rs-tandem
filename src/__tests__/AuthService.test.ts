import { describe, it, expect } from 'vitest';

import { AuthService } from '../features/auth/AuthService';

describe('AuthService', () => {
  it('isAuthenticated возвращает false по умолчанию', () => {
    const service = new AuthService();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('getUser возвращает null по умолчанию', () => {
    const service = new AuthService();
    expect(service.getUser()).toBeNull();
  });

  it('setUser устанавливает пользователя', () => {
    const service = new AuthService();
    const fakeUser = { uid: '1', email: 'a@b.com' } as never;
    service.setUser(fakeUser);
    expect(service.getUser()).toBe(fakeUser);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('setUser(null) сбрасывает пользователя', () => {
    const service = new AuthService();
    service.setUser(null);
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getUser()).toBeNull();
  });
});
