import { Router } from 'vanilla-routing';

import { Button } from '../../shared/components';
import { DOMHelper } from '../../shared/utils/createElement';
import { authService } from '../auth/AuthService';
import './NotFoundPage.css';

export class NotFoundPage {
  private readonly element: HTMLElement;

  constructor() {
    this.element = DOMHelper.createElement('section', 'not-found');
    this.render();
  }

  private render(): void {
    const container = DOMHelper.createElement('div', 'not-found__container');
    const title = DOMHelper.createElement(
      'h1',
      'not-found__title',
      'Страница не найдена',
    );
    const description = DOMHelper.createElement(
      'p',
      'not-found__description',
      'Похоже, такой страницы не существует.',
    );
    const actions = DOMHelper.createElement('div', 'not-found__actions');
    const backButton = new Button('Назад', 'grey', () => {
      Router.go(authService.isAuthenticated() ? '/' : '/auth');
    });

    const homeButton = new Button('На главную', 'grey', () => {
      if (authService.isAuthenticated()) {
        Router.go('/');
      } else {
        Router.go('/auth');
      }
    });

    const rightImg = DOMHelper.createElement('div', 'right-img');
    const notFoundImg = DOMHelper.createElement('img', 'not-found__image');
    notFoundImg.src = new URL(
      '../../assets/img/mascot_sad_transparent.png',
      import.meta.url,
    ).toString();

    rightImg.append(notFoundImg);
    actions.append(backButton.getElement(), homeButton.getElement());
    container.append(title, description, actions);
    this.element.append(container, rightImg);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
