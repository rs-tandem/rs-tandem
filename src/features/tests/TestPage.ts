import { DOMHelper } from '../../shared/utils/createElement';

export class TestsPage {
  private readonly element: HTMLElement;

  private readonly questionElement: HTMLElement;

  private readonly optionsElement: HTMLElement;

  private readonly explanationElement: HTMLElement;

  private readonly nextButton: HTMLButtonElement;

  constructor() {
    this.element = DOMHelper.createElement('section', 'tests-page');
    this.questionElement = DOMHelper.createElement(
      'div',
      'tests-page_question',
    );
    this.optionsElement = DOMHelper.createElement('div', 'tests-page__options');
    this.explanationElement = DOMHelper.createElement(
      'div',
      'tests-page__options',
    );
    this.nextButton = DOMHelper.createElement(
      'button',
      'tests-page__next-button',
      'Следующий вопрос',
    );
    this.render();
  }

  private render(): void {
    const card = DOMHelper.createElement('div', 'tests-page__card');
    const title = DOMHelper.createElement('h1', 'tests-page__title', 'Тесты');

    this.explanationElement.hidden = true;
    card.append(
      title,
      this.questionElement,
      this.optionsElement,
      this.explanationElement,
      this.nextButton,
    );
    this.element.append(card);
  }
}
