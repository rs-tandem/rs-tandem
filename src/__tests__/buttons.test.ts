import { describe, it, expect, vi } from 'vitest';

import { Button, type ButtonType } from '../shared/components/Button/Button';
import '../shared/components/Button/Button.css';

const ONE = 1;

describe('Button', () => {
  it('создание кнопки', () => {
    const button = new Button('Test');
    expect(button.getElement().textContent).toBe('Test');
  });

  it('применение нужного цвета', () => {
    const types: ButtonType[] = ['orange', 'grey', 'yellow', 'green'];

    types.forEach((type) => {
      const button = new Button('Test', type);
      expect(button.getElement().className).toContain(`button-${type}`);
    });
  });

  it('onClick при клике', () => {
    const mockFn = vi.fn();
    const button = new Button('Test', 'grey', mockFn);

    button.getElement().click();
    expect(mockFn).toHaveBeenCalledTimes(ONE);
  });

  it('setDisabled меняет disabled атрибут', () => {
    const button = new Button('Test');

    button.setDisabled(true);
    expect(button.getElement().disabled).toBe(true);

    button.setDisabled(false);
    expect(button.getElement().disabled).toBe(false);
  });

  it('изменение текста кнопки', () => {
    const button = new Button('Initial');
    expect(button.getElement().textContent).toBe('Initial');

    button.setText('Updated');
    expect(button.getElement().textContent).toBe('Updated');
  });

  it('getElement возвращает HTMLButtonElement', () => {
    const button = new Button('Test');
    expect(button.getElement()).toBeInstanceOf(HTMLButtonElement);
  });
});
