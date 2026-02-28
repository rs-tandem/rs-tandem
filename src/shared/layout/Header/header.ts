import { Button } from '../../components';
import { DOMHelper } from '../../utils/createElement';
import './header.css';

export class Header {
  private readonly element: HTMLElement;

  private readonly titleEl: HTMLElement;

  constructor() {
    this.element = DOMHelper.createElement('header', 'app-header');
    this.titleEl = DOMHelper.createElement('div', 'header-title');
    this.setTitle('Interview', 'Prep');
    this.render();
  }

  public setTitle(mainText: string, accentText?: string): void {
    this.titleEl.replaceChildren(document.createTextNode(`${mainText} `));

    if (accentText !== undefined && accentText !== '') {
      const accent = DOMHelper.createElement('span', 'accent', accentText);
      this.titleEl.append(accent);
    }
  }

  private render(): void {
    const container = DOMHelper.createElement('div', 'header-container');

    const logoLink = DOMHelper.createElement('a', 'header-left logo-link');
    logoLink.setAttribute('href', '/');
    logoLink.setAttribute('data-vanilla-route-link', 'spa');

    const logo = DOMHelper.createElement('div', 'logo', 'JS');
    logoLink.append(logo, this.titleEl);

    const right = DOMHelper.createElement('div', 'header-right');

    const settingsButton = new Button('Settings', 'grey', () => {
      // TBD
    });

    const homeButton = new Button('HOME', 'grey', () => {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    right.append(settingsButton.getElement(), homeButton.getElement());

    container.append(logoLink, right);
    this.element.append(container);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
