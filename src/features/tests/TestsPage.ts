import { Router } from 'vanilla-routing';

import errorSound from '../../assets/sounds/error.wav';
import successSound from '../../assets/sounds/success.mp3';
import { Button } from '../../shared/components';
import { DOMHelper } from '../../shared/utils/createElement';

import { saveTestResult } from './results.storage';
import { getRandomQuestionByTopic, checkAnswer } from './tests.api';
import type { Question } from './tests.types';
import './tests-page.css';

const SOUND_VOLUME = 0.4;
const SOUND_STORAGE_KEY = 'sound-enabled';
const TOTAL_QUESTIONS = 10;
const INITIAL_ATTEMPTS = 0;
const EXCELLENT_SCORE = 90;
const GOOD_SCORE = 70;
const OK_SCORE = 40;
const PERCENT_MULTIPLIER = 100;

function getFinishTitle(scorePercent: number): string {
  if (scorePercent >= EXCELLENT_SCORE) {
    return 'Отличный результат 🎉';
  }

  if (scorePercent >= GOOD_SCORE) {
    return 'Хорошая работа 👏';
  }

  if (scorePercent >= OK_SCORE) {
    return 'Неплохо, но можно лучше 💪';
  }

  return 'Попробуй ещё раз';
}

function createFinishMascot(): HTMLImageElement {
  const mascot = DOMHelper.createElement('img', 'tests-page__finish-image');

  mascot.src = new URL(
    '../../assets/img/excellent.png',
    import.meta.url,
  ).toString();

  mascot.alt = 'Mascot';

  return mascot;
}

export class TestsPage {
  private readonly element: HTMLElement;

  private readonly questionElement: HTMLElement;

  private readonly optionsElement: HTMLElement;

  private readonly explanationElement: HTMLElement;

  private readonly nextButton: HTMLButtonElement;

  private readonly successSound: HTMLAudioElement;

  private readonly errorSound: HTMLAudioElement;

  private readonly progressElement: HTMLElement;

  private questionIndex = INITIAL_ATTEMPTS;

  private correctAnswersCount = INITIAL_ATTEMPTS;

  private readonly totalQuestions = TOTAL_QUESTIONS;

  private currentQuestion: Question | null = null;

  private isAnswered = false;

  private isResultSaved = false;

  constructor(private readonly topicId: string) {
    this.element = DOMHelper.createElement('section', 'tests-page');
    this.progressElement = DOMHelper.createElement(
      'div',
      'tests-page__progress',
    );
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
    this.successSound = new Audio(successSound);
    this.errorSound = new Audio(errorSound);
    this.successSound.volume = SOUND_VOLUME;
    this.errorSound.volume = SOUND_VOLUME;

    this.render();
    this.addEventListeners();
    this.preloadSounds();
    this.loadQuestion();
  }

  private render(): void {
    const card = DOMHelper.createElement('div', 'tests-page__card');

    this.explanationElement.hidden = true;
    this.nextButton.disabled = true;
    card.append(
      this.progressElement,
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

  private preloadSounds(): void {
    this.successSound.load();
    this.errorSound.load();
  }

  private async loadQuestion(): Promise<void> {
    if (this.questionIndex >= this.totalQuestions) {
      this.showFinish();
      return;
    }
    this.questionIndex += 1;

    this.progressElement.textContent = `Вопрос ${this.questionIndex} из ${this.totalQuestions}`;
    this.resetState();
    try {
      this.questionElement.textContent = 'Загрузка...';
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

      if (result.correct) {
        this.correctAnswersCount += 1;
      }
      if (!this.isResultSaved && this.questionIndex === this.totalQuestions) {
        const scorePercent = Math.round(
          (this.correctAnswersCount / this.totalQuestions) * PERCENT_MULTIPLIER,
        );

        saveTestResult({
          topicId: this.topicId,
          correctAnswers: this.correctAnswersCount,
          totalQuestions: this.totalQuestions,
          scorePercent,
          completedAt: new Date().toISOString(),
        });

        this.isResultSaved = true;
      }

      selectedButton.classList.add(
        result.correct
          ? 'tests-page__option--correct'
          : 'tests-page__option--incorrect',
      );
      this.nextButton.disabled = false;
      this.playAnswerSound(result.correct);
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

  private playAnswerSound(isCorrect: boolean): void {
    const isSoundEnabled = localStorage.getItem(SOUND_STORAGE_KEY) !== 'off';

    if (!isSoundEnabled) {
      return;
    }

    const sound = isCorrect ? this.successSound : this.errorSound;
    sound.currentTime = 0;
    sound.play().catch((error) => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    });
  }

  private toggleOptions(disabled: boolean): void {
    const buttons = this.optionsElement.querySelectorAll<HTMLButtonElement>(
      '.tests-page__option',
    );

    buttons.forEach((button) => {
      const optionButton = button;
      optionButton.disabled = disabled;
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

  private createFinishActions(): HTMLElement {
    const actions = DOMHelper.createElement(
      'div',
      'tests-page__finish-actions',
    );

    const restartButton = new Button('Пройти заново', 'orange', () => {
      this.questionIndex = INITIAL_ATTEMPTS;
      this.correctAnswersCount = INITIAL_ATTEMPTS;
      this.isResultSaved = false;
      this.element.replaceChildren();
      this.render();
      this.loadQuestion();
    });

    const backButton = new Button('К темам', 'grey', () => {
      Router.go('/');
    });

    actions.append(restartButton.getElement(), backButton.getElement());

    return actions;
  }

  private createFinishContent(scorePercent: number): HTMLElement {
    const card = DOMHelper.createElement('div', 'tests-page__finish-card');

    const title = DOMHelper.createElement(
      'h2',
      'tests-page__finish-title',
      getFinishTitle(scorePercent),
    );

    const score = DOMHelper.createElement(
      'div',
      'tests-page__finish-score',
      `${this.correctAnswersCount} / ${this.totalQuestions}`,
    );

    const percent = DOMHelper.createElement(
      'p',
      'tests-page__finish-percent',
      `${scorePercent}% правильных ответов`,
    );

    card.append(title, score, percent, this.createFinishActions());

    return card;
  }

  private showFinish(): void {
    this.element.replaceChildren();

    const container = DOMHelper.createElement('div', 'tests-page__finish');

    const scorePercent = Math.round(
      (this.correctAnswersCount / this.totalQuestions) * PERCENT_MULTIPLIER,
    );

    container.append(
      this.createFinishContent(scorePercent),
      createFinishMascot(),
    );

    this.element.append(container);
  }

  private resetState(): void {
    this.currentQuestion = null;
    this.isAnswered = false;
    this.nextButton.disabled = true;
    this.optionsElement.innerHTML = '';
    this.explanationElement.hidden = true;

    this.explanationElement.textContent = '';
    this.explanationElement.classList.remove('tests-page__explanation--error');
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
