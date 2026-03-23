import { DOMHelper } from '../../shared/utils/createElement';

import { getRandomQuestionByTopic, checkAnswer } from './tests.api';
import type { Question } from './tests.types';
import './tests-page.css';

export class TestsPage {
  private readonly element: HTMLElement;

  private readonly questionElement: HTMLElement;

  private readonly optionsElement: HTMLElement;

  private readonly explanationElement: HTMLElement;

  private readonly nextButton: HTMLButtonElement;

  private currentQuestion: Question | null = null;

  private isAnswered = false;

  constructor(private readonly topicId: string) {
    this.element = DOMHelper.createElement('section', 'tests-page');
    this.questionElement = DOMHelper.createElement(
      'div',
      'tests-page__question',
    );
    this.optionsElement = DOMHelper.createElement('div', 'tests-page__options');
    this.explanationElement = DOMHelper.createElement(
      'div',
      'tests-page__explanation',
    );
    this.nextButton = DOMHelper.createElement(
      'button',
      'tests-page__next-button',
      'Следующий вопрос',
    );
    this.render();
    this.addEventListeners();
    this.loadQuestion();
  }

  private render(): void {
    const card = DOMHelper.createElement('div', 'tests-page__card');

    this.explanationElement.hidden = true;
    card.append(
      this.questionElement,
      this.optionsElement,
      this.explanationElement,
      this.nextButton,
    );
    this.element.append(card);
  }

  private addEventListeners(): void {
    this.nextButton.addEventListener('click', () => {
      this.loadQuestion();
    });
  }

  private async loadQuestion(): Promise<void> {
    this.resetState();
    try {
      const question = await getRandomQuestionByTopic(this.topicId);
      this.currentQuestion = question;
      this.questionElement.textContent = question.question;
      this.renderOptions(question.options);
    } catch (error) {
      this.questionElement.textContent = 'Не удалось загрузить вопрос';
      this.showExplanation(
        error instanceof Error ? error.message : 'Unknown error',
        true,
      );
    }
  }

  private renderOptions(options: string[]): void {
    this.optionsElement.innerHTML = '';

    options.forEach((option, index) => {
      const button = DOMHelper.createElement(
        'button',
        'tests-page__option',
        option,
      );

      button.addEventListener('click', () => {
        this.handleAnswer(index, button);
      });

      this.optionsElement.append(button);
    });
  }

  private async handleAnswer(
    answerIndex: number,
    selectedButton: HTMLButtonElement,
  ): Promise<void> {
    if (!this.currentQuestion || this.isAnswered) {
      return;
    }

    this.isAnswered = true;
    this.toggleOptions(true);

    try {
      const result = await checkAnswer({
        questionId: this.currentQuestion.id,
        answerIndex,
      });

      selectedButton.classList.add(
        result.correct
          ? 'tests-page__option--correct'
          : 'tests-page__option--incorrect',
      );

      this.showExplanation(result.explanation, false);
    } catch (error) {
      this.showExplanation(
        error instanceof Error ? error.message : 'Unknown error',
        true,
      );
      this.toggleOptions(false);
      this.isAnswered = false;
    }
  }

  private toggleOptions(_disabled: boolean): void {
    const buttons = this.optionsElement.querySelectorAll<HTMLButtonElement>(
      '.tests-page__option',
    );

    buttons.forEach((button) => {
      const optionButton = button;
      optionButton.disabled = true;
    });
  }

  private showExplanation(text: string, isError: boolean): void {
    this.explanationElement.hidden = false;
    this.explanationElement.textContent = text;
    this.explanationElement.classList.toggle(
      'tests-page__explanation--error',
      isError,
    );
  }

  private resetState(): void {
    this.currentQuestion = null;
    this.isAnswered = false;
    this.optionsElement.innerHTML = '';
    this.explanationElement.hidden = true;
    this.explanationElement.textContent = '';
    this.explanationElement.classList.remove('tests-page__explanation--error');
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
