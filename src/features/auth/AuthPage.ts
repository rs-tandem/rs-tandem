// import { navigateTo } from '../../core/router/routes';
import { Button, Input } from '../../shared/components';
import { DOMHelper } from '../../shared/utils/createElement';

import { authService } from './AuthService';

export class AuthPage {
  private element: HTMLElement;

  private isLoginMode = true;

  private emailInput: Input;

  private passwordInput: Input;

  private nameInput: Input;

  private errorMessage: HTMLElement;

  constructor() {
    this.element = DOMHelper.createElement('div', 'auth-page');

    this.emailInput = new Input('Email', 'email');
    this.passwordInput = new Input('Пароль', 'password');
    this.nameInput = new Input('Имя (опционально)', 'text');
    this.errorMessage = DOMHelper.createElement('div', 'error-message');

    this.render();
  }

  private render(): void {
    this.element.innerHTML = '';

    const container = DOMHelper.createElement('div', 'auth-container');

    const title = DOMHelper.createElement(
      'h1',
      'auth-title',
      this.isLoginMode ? 'Вход' : 'Регистрация',
    );

    const form = DOMHelper.createElement('form', 'auth-form');
    form.append(this.emailInput.getWrapperElement());
    form.append(this.passwordInput.getWrapperElement());

    if (!this.isLoginMode) {
      form.append(this.nameInput.getWrapperElement());
    }

    form.append(this.errorMessage);

    const submitButton = new Button(
      this.isLoginMode ? 'Войти' : 'Зарегистрироваться',
      'orange',
    );

    const toggleButton = new Button(
      this.isLoginMode
        ? 'Нет аккаунта? Зарегистрируйтесь'
        : 'Уже есть аккаунт? Войдите',
      'grey',
    );

    form.append(submitButton.getElement());
    form.append(toggleButton.getElement());

    container.append(title, form);
    this.element.append(container);

    form.addEventListener('submit', (event) => this.handleSubmit(event));
    toggleButton.setOnClick(() => this.toggleMode());
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const email = this.emailInput.getValue();
    const password = this.passwordInput.getValue();
    const name = this.nameInput.getValue();

    if (!email || !password) {
      this.showError('Заполните все поля');
      return;
    }

    this.clearError();
    this.emailInput.setError(false);
    this.passwordInput.setError(false);

    if (this.isLoginMode) {
      const result = await authService.login(email, password);

      if (result.success) {
        // navigateTo('/topics');
      } else {
        this.showError(result.error || 'Ошибка входа');
        this.emailInput.setError(true);
        this.passwordInput.setError(true);
      }
    } else {
      const result = await authService.register(email, password, name);

      if (result.success) {
        // navigateTo('/topics');
      } else {
        this.showError(result.error || 'Ошибка регистрации');
        this.emailInput.setError(true);
        this.passwordInput.setError(true);
      }
    }
  }

  private toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.clearError();
    this.render();
  }

  private showError(message: string): void {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = 'block';
  }

  private clearError(): void {
    this.errorMessage.textContent = '';
    this.errorMessage.style.display = 'none';
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
