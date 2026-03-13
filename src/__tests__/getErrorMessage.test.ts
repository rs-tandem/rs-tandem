import { describe, it, expect } from 'vitest';

import { getErrorMessage } from '../core/firebase/auth';

describe('getErrorMessage', () => {
  it('Возвращает сообщение для auth/email-already-in-use', () => {
    expect(getErrorMessage({ code: 'auth/email-already-in-use' })).toBe(
      'Этот email уже используется',
    );
  });

  it('Возвращает сообщение для auth/wrong-password', () => {
    expect(getErrorMessage({ code: 'auth/wrong-password' })).toBe(
      'Неверный пароль',
    );
  });

  it('Возвращает fallback для неизвестного кода', () => {
    expect(getErrorMessage({ code: 'auth/unknown-code' })).toBe(
      'Произошла ошибка',
    );
  });

  it('Возвращает "Неизвестная ошибка" для строки', () => {
    expect(getErrorMessage('строка')).toBe('Неизвестная ошибка');
  });

  it('Возвращает "Неизвестная ошибка" для null', () => {
    expect(getErrorMessage(null)).toBe('Неизвестная ошибка');
  });
});
