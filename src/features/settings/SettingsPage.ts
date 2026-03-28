import { Button } from '../../shared/components';
import { DOMHelper } from '../../shared/utils/createElement';
import { clearStoredResults, getStoredResults } from '../tests/results.storage';
import { getTopicTitleById } from '../topics/topics.data';
import './settings-page.css';

const SOUND_STORAGE_KEY = 'sound-enabled';
const MAX_RESULTS_TO_SHOW = 5;
const INITIAL_ATTEMPTS = 0;

export class SettingsPage {
  private readonly element: HTMLElement;

  constructor() {
    this.element = DOMHelper.createElement('section', 'settings-page');
    this.render();
  }

  private createResultsBlock(): HTMLElement {
    const block = DOMHelper.createElement('div', 'settings-page__results');

    const title = DOMHelper.createElement(
      'h2',
      'settings-page__results-title',
      'Результаты тестов',
    );

    block.append(title);

    const results = getStoredResults();

    if (results.length === INITIAL_ATTEMPTS) {
      block.append(
        DOMHelper.createElement(
          'p',
          'settings-page__results-empty',
          'Результатов пока нет.',
        ),
      );

      return block;
    }

    const list = DOMHelper.createElement('div', 'settings-page__results-list');

    results.slice(INITIAL_ATTEMPTS, MAX_RESULTS_TO_SHOW).forEach((result) => {
      const item = DOMHelper.createElement('div', 'settings-page__result-item');

      const topic = DOMHelper.createElement(
        'div',
        'settings-page__result-topic',
        getTopicTitleById(result.topicId),
      );

      const score = DOMHelper.createElement(
        'div',
        'settings-page__result-score',
        `${result.correctAnswers}/${result.totalQuestions} • ${result.scorePercent}%`,
      );

      const date = DOMHelper.createElement(
        'div',
        'settings-page__result-date',
        new Date(result.completedAt).toLocaleString(),
      );

      item.append(topic, score, date);
      list.append(item);
    });

    const clearButton = new Button('Очистить историю', 'grey', () => {
      clearStoredResults();
      this.element.replaceChildren();
      this.render();
    });

    block.append(list, clearButton.getElement());

    return block;
  }

  private render(): void {
    const wrapper = DOMHelper.createElement('div', 'settings-page__wrapper');

    const left = DOMHelper.createElement('div', 'settings-page__left');
    const right = DOMHelper.createElement('div', 'settings-page__right');

    const soundRow = DOMHelper.createElement('div', 'settings-page__row');
    const soundLabel = DOMHelper.createElement(
      'label',
      'settings-page__label',
      'Звук',
    );

    const stored = localStorage.getItem(SOUND_STORAGE_KEY);
    const isSoundEnabled = stored === null || stored !== 'off';

    const soundToggle = DOMHelper.createElement(
      'button',
      'settings-page__toggle',
      isSoundEnabled ? 'ON' : 'OFF',
    );
    soundToggle.setAttribute('type', 'button');
    soundToggle.setAttribute('aria-pressed', String(isSoundEnabled));

    soundToggle.addEventListener('click', () => {
      const currentValue = localStorage.getItem(SOUND_STORAGE_KEY) !== 'off';
      const nextValue = !currentValue;

      localStorage.setItem(SOUND_STORAGE_KEY, nextValue ? 'on' : 'off');

      soundToggle.textContent = nextValue ? 'ON' : 'OFF';
      soundToggle.setAttribute('aria-pressed', String(nextValue));
      soundToggle.classList.toggle('settings-page__toggle--active', nextValue);
    });
    const mascot = DOMHelper.createElement('img', 'settings-page__image');
    mascot.src = new URL(
      '../../assets/img/mascot_settings.png',
      import.meta.url,
    ).toString();
    mascot.alt = 'Mascot';

    left.append(mascot);
    soundRow.append(soundLabel, soundToggle);
    right.append(soundRow);

    wrapper.append(left, right);
    this.element.append(wrapper, this.createResultsBlock());
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
