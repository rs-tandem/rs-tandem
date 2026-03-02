import './Button.css';
import { DOMHelper } from '../../utils/createElement';

export type ButtonType = 'orange' | 'grey' | 'yellow' | 'green';

export class Button {
  private element: HTMLButtonElement;

  private clickHandler?: () => void;

  constructor(
    text: string,
    typeButton: ButtonType = 'grey',
    onClick?: () => void,
  ) {
    this.element = DOMHelper.createElement(
      'button',
      `button button-${typeButton}`,
      text,
    );

    if (onClick) {
      this.element.addEventListener('click', onClick);
    }
  }

  // Я не как без этого возвращать элемент, если через свойство не приватное обращаться
  getElement(): HTMLButtonElement {
    return this.element;
  }

  setDisabled(disabled: boolean): void {
    this.element.disabled = disabled;
  }

  setText(text: string): void {
    this.element.textContent = text;
  }

  setOnClick(onClick: () => void): void {
    if (this.clickHandler) {
      this.element.removeEventListener('click', this.clickHandler);
    }

    this.clickHandler = onClick;
    this.element.addEventListener('click', onClick);
  }
}
