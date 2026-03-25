import { Router } from 'vanilla-routing';

import { authService } from '../../../features/auth/AuthService';
import { Button } from '../../components';
import { DOMHelper } from '../../utils/createElement';
import './header.css';

export class Header {
  private readonly element: HTMLElement;

  private readonly titleEl: HTMLElement;

  private readonly right: HTMLElement;

  constructor() {
    this.element = DOMHelper.createElement('header', 'app-header');
    this.titleEl = DOMHelper.createElement('div', 'header-title');
    this.right = DOMHelper.createElement('div', 'header-right');
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

  public updateAuthState(): void {
    this.right.replaceChildren();

    const settingsButton = new Button('Настройки', 'grey', () => {
      Router.go('/settings');
    });

    this.right.append(settingsButton.getElement());

    const homeButton = new Button('HOME', 'grey', () => {
      if (authService.isAuthenticated()) {
        Router.go('/');
      } else {
        Router.go('/auth');
      }
    });

    this.right.append(homeButton.getElement());

    if (authService.isAuthenticated()) {
      const logoutButton = new Button('Выйти', 'grey', async () => {
        await authService.logout();
        Router.go('/auth');
      });
      this.right.append(logoutButton.getElement());
    }
  }

  private render(): void {
    const container = DOMHelper.createElement('div', 'header-container');

    const logoLink = DOMHelper.createElement('div', 'header-left logo-link');
    logoLink.style.cursor = 'pointer';
    logoLink.addEventListener('click', () => {
      if (authService.isAuthenticated()) {
        Router.go('/');
      } else {
        Router.go('/auth');
      }
    });

    const logo = DOMHelper.createElement('div', 'logo', 'JS');
    logoLink.append(logo, this.titleEl);

    this.updateAuthState();

    container.append(logoLink, this.right);
    this.element.append(container);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
