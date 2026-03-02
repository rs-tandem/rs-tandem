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

  // Я не как без этого возвращать элемент, если только через свойство неприватное обращаться
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
