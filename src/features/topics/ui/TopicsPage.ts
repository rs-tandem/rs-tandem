import { DOMHelper } from '../../../shared/utils/createElement';
import { TOPICS } from '../TopicsService';

import { TopicCard } from './TopicCard';

import './TopicsPage.css';

export class TopicsPage {
  private readonly element: HTMLElement;

  constructor() {
    this.element = DOMHelper.createElement('section', 'topics-page');
    this.render();
  }

  private render(): void {
    const wrapper = DOMHelper.createElement('div', 'topics-page__wrapper');

    const left = DOMHelper.createElement('div', 'topics-page__left');
    const right = DOMHelper.createElement('div', 'topics-page__right');

    const title = DOMHelper.createElement(
      'h1',
      'topics-page__title',
      'Привет! Выбери тему для тренировки',
    );

    const grid = DOMHelper.createElement('div', 'topics-grid');

    TOPICS.forEach((topic) => {
      const card = new TopicCard(topic);
      grid.append(card.getElement());
    });

    const image = DOMHelper.createElement('img');
    image.src = new URL(
      '../../../assets/img/mascot_pointing_transparent.png',
      import.meta.url,
    ).toString();
    image.className = 'topics-page__image';

    left.append(title, grid);
    right.append(image);

    wrapper.append(left, right);
    this.element.append(wrapper);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
