import './Input.css';
import { DOMHelper } from '../../utils/createElement';

export class Input {
  private element: HTMLInputElement;

  private wrapper: HTMLDivElement;

  constructor(placeholder?: string, type = 'text') {
    // Я не знаю как без wrapper сделал рамку как на макете
    this.wrapper = DOMHelper.createElement('div', 'input-wrapper');
    this.element = DOMHelper.createElement('input', 'input');
    this.element.type = type;

    if (placeholder) {
      this.element.placeholder = placeholder;
    }
    this.wrapper.appendChild(this.element);
  }

  public enablePasswordToggle(): void {
    if (this.wrapper.classList.contains('input-wrapper--with-toggle')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'input-toggle-password';
    toggleBtn.setAttribute('aria-label', 'Показать пароль');
    toggleBtn.innerHTML = this.getEyeIcon(false);

    toggleBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isHidden = this.element.type === 'password';
      this.element.type = isHidden ? 'text' : 'password';

      toggleBtn.innerHTML = this.getEyeIcon(isHidden);
      toggleBtn.setAttribute(
        'aria-label',
        isHidden ? 'Скрыть пароль' : 'Показать пароль',
      );
      this.element.focus();
    });

    this.wrapper.classList.add('input-wrapper--with-toggle');
    this.wrapper.appendChild(toggleBtn);
  }

  // eslint-disable-next-line class-methods-use-this
  private getEyeIcon(isVisible: boolean): string {
    if (isVisible) {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`;
    }
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`;
  }

  getElement(): HTMLInputElement {
    return this.element;
  }

  getWrapperElement(): HTMLDivElement {
    return this.wrapper;
  }

  getValue(): string {
    return this.element.value;
  }

  setValue(value: string): void {
    this.element.value = value;
  }

  setError(hasError: boolean): void {
    this.wrapper.classList.toggle('error', hasError);
  }

  onChange(callback: (value: string) => void): void {
    this.element.addEventListener('input', () => callback(this.element.value));
  }
}
