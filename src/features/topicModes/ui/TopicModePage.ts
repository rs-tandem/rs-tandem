import { Router } from 'vanilla-routing';

import tasksIcon from '../../../assets/img/icon_2.png';
import aiIcon from '../../../assets/img/icon_3.png';
import testsIcon from '../../../assets/img/icon_transparent_1.png';
import mascotUrl from '../../../assets/img/mascot_rsschool_transparent.png';
import { DOMHelper } from '../../../shared/utils/createElement';
import { getTopicTitleById } from '../../topics/topics.data';

import './topic-mode-page.css';

interface TopicModeItem {
  title: string;
  description: string;
  className: string;
  path: string;
  icon: string;
}

const TOPIC_MODES: TopicModeItem[] = [
  {
    title: 'Тесты',
    description: 'Короткие вопросы',
    className: 'topic-mode-page__mode-card--tests',
    path: 'tests',
    icon: testsIcon,
  },
  {
    title: 'Задачи',
    description: 'Практика по теме',
    className: 'topic-mode-page__mode-card--tasks',
    path: 'tasks',
    icon: tasksIcon,
  },
  {
    title: 'Режим ИИ',
    description: 'Обсуждение и помощь',
    className: 'topic-mode-page__mode-card--ai',
    path: 'ai',
    icon: aiIcon,
  },
];

function createModeCard(
  mode: TopicModeItem,
  topicId: string,
): HTMLButtonElement {
  const card = DOMHelper.createElement(
    'button',
    `topic-mode-page__mode-card ${mode.className}`,
  );
  const icon = DOMHelper.createElement('img', 'topic-mode-page__mode-icon');

  icon.src = mode.icon;
  icon.alt = mode.title;
  const title = DOMHelper.createElement(
    'div',
    'topic-mode-page__mode-title',
    mode.title,
  );

  const description = DOMHelper.createElement(
    'div',
    'topic-mode-page__mode-description',
    mode.description,
  );

  card.append(icon, title, description);
  card.addEventListener('click', () => {
    Router.go(`/topic/${topicId}/${mode.path}`);
  });

  return card;
}

export class TopicModePage {
  private readonly element: HTMLElement;

  constructor(private readonly topicId: string) {
    this.element = DOMHelper.createElement('section', 'topic-mode-page');
    this.render();
  }

  private render(): void {
    const wrapper = DOMHelper.createElement('div', 'topic-mode-page__wrapper');
    const left = DOMHelper.createElement('div', 'topic-mode-page__left');
    const right = DOMHelper.createElement('div', 'topic-mode-page__right');

    const backButton = DOMHelper.createElement(
      'button',
      'topic-mode-page__back',
      '← Назад к темам',
    );

    backButton.addEventListener('click', () => Router.go('/'));

    const topicLabel = DOMHelper.createElement(
      'div',
      'topic-mode-page__label',
      getTopicTitleById(this.topicId),
    );

    const title = DOMHelper.createElement(
      'h1',
      'topic-mode-page__title',
      'Выбери формат тренировки',
    );

    const modes = DOMHelper.createElement('div', 'topic-mode-page__modes');
    TOPIC_MODES.forEach((mode) => {
      modes.append(createModeCard(mode, this.topicId));
    });

    const mascot = DOMHelper.createElement('img', 'topic-mode-page__image');
    mascot.src = mascotUrl;
    mascot.alt = 'Mascot';

    left.append(topicLabel, title, modes, backButton);
    right.append(mascot);
    wrapper.append(left, right);
    this.element.append(wrapper);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
