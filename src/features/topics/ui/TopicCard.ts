import { DOMHelper } from '../../../shared/utils/createElement';
import type { Topic } from '../topics.types';

import './TopicCard.css';

export class TopicCard {
  private readonly element: HTMLAnchorElement;

  constructor(private readonly topic: Topic) {
    this.element = DOMHelper.createElement('a', `topic-card topic-${topic.id}`);
    this.render();
  }

  private render(): void {
    this.element.href = `/topic/${this.topic.id}`;
    this.element.setAttribute('data-vanilla-route-link', 'spa');

    const content = DOMHelper.createElement('div', 'topic-card__content');

    const icon = DOMHelper.createElement('img', 'topic-card__icon');
    icon.src = this.topic.imageUrl;
    icon.alt = `${this.topic.title} icon`;

    const title = DOMHelper.createElement(
      'h3',
      'topic-card__title',
      this.topic.title,
    );

    content.append(title, icon);
    this.element.append(content);
  }

  public getElement(): HTMLAnchorElement {
    return this.element;
  }
}
