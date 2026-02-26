import { DOMHelper } from '../utils/createElement';
import './header.css';

export class Header {
  private readonly element: HTMLElement;

  constructor() {
    this.element = DOMHelper.createElement('header', 'app-header');
    this.render();
  }

  private render(): void {
    const container = DOMHelper.createElement('div', 'header-container');

    const left = DOMHelper.createElement('div', 'header-left');
    const logo = DOMHelper.createElement('div', 'logo', 'JS');
    const logoText = DOMHelper.createElement('div', 'logo-text');
    const text = document.createTextNode('Interview');
    const accent = DOMHelper.createElement('span', 'accent', 'Prep');
    logoText.append(text, accent);
    left.append(logo, logoText);

    const right = DOMHelper.createElement('div', 'header-right');

    container.append(left, right);
    this.element.append(container);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
