import { DOMHelper } from '../../shared/utils/createElement';

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

    const rightImg = DOMHelper.createElement('div', 'not-found__right-img');
    const notFoundImg = DOMHelper.createElement('img', 'not-found__image');
    notFoundImg.src = new URL(
      '../../assets/img/mascot_sad_transparent.png',
      import.meta.url,
    ).toString();

    rightImg.append(notFoundImg);

    container.append(title, description);
    this.element.append(container, rightImg);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
