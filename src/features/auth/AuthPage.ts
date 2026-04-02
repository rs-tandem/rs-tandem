/* eslint-disable class-methods-use-this */
import { Router } from 'vanilla-routing';

import mascotUrl from '../../assets/img/mascot_laptop_transparent.png';
import { Button, Input } from '../../shared/components';
import { PasswordStrength } from '../../shared/components/PasswordStrength/PasswordStrength';
import { DOMHelper } from '../../shared/utils/createElement';

import { authService } from './AuthService';

import './auth.css';

export class AuthPage {
  private element: HTMLElement;

  private isLoginMode = true;

  private emailInput: Input;

  private passwordInput: Input;

  private nameInput: Input;

  private errorMessage: HTMLElement;

  private loginButton: Button;

  private registerButton: Button;

  private googleButton: Button;

  private passwordStrength: PasswordStrength;

  constructor() {
    this.element = DOMHelper.createElement('div', 'auth-page');

    this.emailInput = new Input('Email', 'email');
    this.passwordInput = new Input('Пароль', 'password');
    this.passwordInput.enablePasswordToggle();
    this.nameInput = new Input('Имя (опционально)', 'text');
    this.errorMessage = DOMHelper.createElement('div', 'error-message');

    this.loginButton = new Button('Войти', 'orange');
    this.registerButton = new Button('Регистрация', 'grey');
    this.googleButton = new Button('Войти через Google', 'grey');

    this.passwordStrength = new PasswordStrength();

    this.render();
  }

  private render(): void {
    this.element.innerHTML = '';

    const container = DOMHelper.createElement('div', 'auth-container');
    const content = DOMHelper.createElement('div', 'auth-content');

    const formSection = this.createFormSection();
    const mascotSection = this.createMascotSection();

    content.append(formSection, mascotSection);
    container.append(content);
    this.element.append(container);

    this.setupEventListeners();
  }

  private createFormSection(): HTMLElement {
    const section = DOMHelper.createElement('div', 'auth-form-section');

    const title = DOMHelper.createElement(
      'h1',
      'auth-title',
      'Добро пожаловать!',
    );
    const subtitle = DOMHelper.createElement(
      'p',
      'auth-subtitle',
      'Войдите в свой аккаунт',
    );

    const form = DOMHelper.createElement('form', 'auth-form');
    form.append(this.emailInput.getWrapperElement());
    form.append(this.passwordInput.getWrapperElement());
    form.append(this.passwordStrength.getElement());

    if (!this.isLoginMode) {
      form.append(this.nameInput.getWrapperElement());
    }

    form.append(this.errorMessage);

    const buttonsContainer = DOMHelper.createElement('div', 'auth-buttons');
    buttonsContainer.append(this.loginButton.getElement());
    buttonsContainer.append(this.registerButton.getElement());
    form.append(buttonsContainer);

    const divider = DOMHelper.createElement('div', 'auth-divider');
    const dividerText = DOMHelper.createElement('span', 'divider-text', 'или');
    divider.append(dividerText);
    form.append(divider);

    this.googleButton.getElement().classList.add('google-button');
    form.append(this.googleButton.getElement());

    const forgotPassword = DOMHelper.createElement(
      'a',
      'forgot-password',
      'Забыли пароль?',
    );
    forgotPassword.setAttribute('href', '#');
    form.append(forgotPassword);

    section.append(title, subtitle, form);
    return section;
  }

  private createMascotSection(): HTMLElement {
    const section = DOMHelper.createElement('div', 'auth-mascot');

    const mascotImg = DOMHelper.createElement('img', 'mascot-image');
    mascotImg.src = mascotUrl;
    mascotImg.alt = 'Interview Prep Mascot';
    mascotImg.loading = 'lazy';

    section.append(mascotImg);
    return section;
  }

  private setupEventListeners(): void {
    const form = this.element.querySelector('.auth-form') as HTMLFormElement;
    const forgotPasswordLink = this.element.querySelector(
      '.forgot-password',
    ) as HTMLAnchorElement;

    form?.addEventListener('submit', (event) => this.handleSubmit(event));

    this.loginButton.setOnClick(() => {
      if (!this.isLoginMode) {
        this.switchToLoginMode();
      } else {
        form.requestSubmit();
      }
    });

    this.registerButton.setOnClick(() => {
      if (this.isLoginMode) {
        this.switchToRegisterMode();
      } else {
        form.requestSubmit();
      }
    });

    this.googleButton.setOnClick(() => this.handleGoogleSignIn());

    forgotPasswordLink?.addEventListener('click', (event) => {
      event.preventDefault();
      this.handleForgotPassword();
    });

    this.emailInput.onChange(() => this.clearError());
    this.passwordInput.onChange(() => this.clearError());

    this.passwordInput.onChange((value) => {
      if (!this.isLoginMode) {
        this.passwordStrength.update(value);
      }
    });
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const email = this.emailInput.getValue().trim();
    const password = this.passwordInput.getValue();
    const name = this.nameInput.getValue().trim();

    if (!this.validateInputs(email, password)) {
      return;
    }

    this.clearError();
    this.setLoading(true);

    try {
      if (this.isLoginMode) {
        const result = await authService.login(email, password);

        if (result.success) {
          Router.replace('/');
        } else {
          this.showError(result.error || 'Ошибка входа');
          this.emailInput.setError(true);
          this.passwordInput.setError(true);
        }
      } else {
        const result = await authService.register(
          email,
          password,
          name || undefined,
        );

        if (result.success) {
          Router.replace('/');
        } else {
          this.showError(result.error || 'Ошибка регистрации');
          this.emailInput.setError(true);
          this.passwordInput.setError(true);
        }
      }
    } finally {
      this.setLoading(false);
    }
  }

  private async handleGoogleSignIn(): Promise<void> {
    this.clearError();
    this.setLoading(true);

    try {
      const result = await authService.loginWithGoogle();

      if (result.success) {
        Router.replace('/');
      } else {
        this.showError(result.error || 'Ошибка входа через Google');
      }
    } finally {
      this.setLoading(false);
    }
  }

  private validateInputs(email: string, password: string): boolean {
    if (!email) {
      this.showError('Введите email');
      this.emailInput.setError(true);
      this.emailInput.getElement().focus();
      return false;
    }

    if (!password) {
      this.showError('Введите пароль');
      this.passwordInput.setError(true);
      this.passwordInput.getElement().focus();
      return false;
    }

    const passwordLength = 6;

    if (password.length < passwordLength) {
      this.showError('Пароль должен содержать минимум 6 символов');
      this.passwordInput.setError(true);
      this.passwordInput.getElement().focus();
      return false;
    }

    return true;
  }

  private switchToLoginMode(): void {
    this.isLoginMode = true;
    this.clearError();

    const loginEl = this.loginButton.getElement();
    const registerEl = this.registerButton.getElement();

    loginEl.className = 'button button-orange';
    registerEl.className = 'button button-grey';

    const title = this.element.querySelector('.auth-title');
    const subtitle = this.element.querySelector('.auth-subtitle');

    if (title) title.textContent = 'Добро пожаловать!';
    if (subtitle) subtitle.textContent = 'Войдите в свой аккаунт';

    const nameWrapper = this.nameInput.getWrapperElement();
    if (nameWrapper.parentElement) {
      nameWrapper.remove();
    }
  }

  private switchToRegisterMode(): void {
    this.isLoginMode = false;
    this.clearError();

    const loginEl = this.loginButton.getElement();
    const registerEl = this.registerButton.getElement();

    loginEl.className = 'button button-grey';
    registerEl.className = 'button button-orange';

    const title = this.element.querySelector('.auth-title');
    const subtitle = this.element.querySelector('.auth-subtitle');

    if (title) title.textContent = 'Создайте аккаунт';
    if (subtitle) subtitle.textContent = 'Заполните данные для регистрации';

    const form = this.element.querySelector('.auth-form');
    const passwordWrapper = this.passwordInput.getWrapperElement();

    if (form && passwordWrapper) {
      passwordWrapper.after(this.nameInput.getWrapperElement());
    }
  }

  private async handleForgotPassword(): Promise<void> {
    const email = this.emailInput.getValue().trim();

    if (!email) {
      this.showError('Введите email для восстановления пароля');
      this.emailInput.setError(true);
      this.emailInput.getElement().focus();
      return;
    }

    this.setLoading(true);
    this.clearError();

    const result = await authService.resetPassword(email);

    this.setLoading(false);

    if (result.success) {
      this.showSuccess('Письмо отправлено! Проверьте почту');
    } else {
      this.showError(result.error || 'Не удалось отправить письмо');
    }
  }

  private showError(message: string): void {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add('show');
  }

  private showSuccess(message: string): void {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.remove('show');
    this.errorMessage.classList.add('show', 'success');
  }

  private clearError(): void {
    this.errorMessage.textContent = '';
    this.errorMessage.classList.remove('show', 'success');
    this.emailInput.setError(false);
    this.passwordInput.setError(false);
  }

  private setLoading(isLoading: boolean): void {
    const form = this.element.querySelector('.auth-form');

    if (isLoading) {
      form?.classList.add('loading');
      this.loginButton.setDisabled(true);
      this.registerButton.setDisabled(true);
      this.googleButton.setDisabled(true);
    } else {
      form?.classList.remove('loading');
      this.loginButton.setDisabled(false);
      this.registerButton.setDisabled(false);
      this.googleButton.setDisabled(false);
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public destroy(): void {
    this.element.remove();
  }
}
