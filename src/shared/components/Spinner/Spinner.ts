import './Spinner.css';
import { DOMHelper } from '../../utils/createElement';

export class Spinner {
  private element: HTMLElement;

  constructor() {
    this.element = DOMHelper.createElement('div', 'spinner');
  }

  show(): void {
    this.element.style.display = 'block';
  }

  hide(): void {
    this.element.style.display = 'none';
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
