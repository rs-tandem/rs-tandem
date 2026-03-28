import { Router } from 'vanilla-routing';

import { setQuestionResult } from '../../../core/store/questionsSlice';
import { store } from '../../../core/store/Store';
import { Button } from '../../../shared/components';
import { Popup } from '../../../shared/components/Popup/Popup';
import { Spinner } from '../../../shared/components/Spinner/Spinner';
import { DOMHelper } from '../../../shared/utils/createElement';
import type { Challenge, CheckResult } from '../tasks.types';
import { ChallengeService } from '../TasksService';

import './tasks-page.css';

const ZERO = 0;
const BASE_TIME_SPINNER = 500;

export class TasksPage {
  private readonly element: HTMLElement;

  private spinner: Spinner | null = null;

  private currentChallenge: Challenge | null = null;

  private taskInfo: HTMLElement | null = null;

  private editorDiv: HTMLElement | null = null;

  private codeEditor: HTMLTextAreaElement | null = null;

  private resultsContainer: HTMLElement | null = null;

  private leftPanel: HTMLElement | null = null;

  private rightPanel: HTMLElement | null = null;

  private solution: { solution: string; explanation: string } | null = null;

  private challengesMenu: HTMLElement | null = null;

  private groupedChallenges: Record<
    string,
    { id: number; title: string; difficulty: string }[]
  > = {};

  private titleContainer: HTMLElement | null = null;

  constructor(private readonly topicId: string) {
    this.spinner = new Spinner();
    this.element = DOMHelper.createElement('section', 'tasks-page');
    this.render();
    this.loadChallengesMenu();
    this.loadRandomChallengeByTopic();
  }

  private render(): void {
    DOMHelper.clearChildren(this.element);
    const header = DOMHelper.createElement('div', 'tasks-page__header');

    const backBtn = new Button('Назад', 'grey', () =>
      Router.go(`/topic/${this.topicId}`),
    );

    const newTaskBtn = new Button('Next Random Task', 'blue', () =>
      this.loadRandomChallengeByTopic(),
    );

    header.append(backBtn.getElement(), newTaskBtn.getElement());

    const content = DOMHelper.createElement('div', 'tasks-page__content');
    this.leftPanel = this.createLeftPanel();
    this.rightPanel = this.createRightPanel();

    content.append(this.leftPanel, this.rightPanel);
    this.element.append(header, content);
  }

  private async loadChallengesMenu(): Promise<void> {
    this.groupedChallenges = await ChallengeService.getChallengesGrouped();
    this.renderChallengesMenu();
  }

  private createLeftPanel(): HTMLElement {
    const panel = DOMHelper.createElement('div', 'tasks-page__panel');

    this.challengesMenu = DOMHelper.createElement('div', 'tasks-page__menu');
    panel.append(this.challengesMenu);

    if (this.currentChallenge) {
      const taskInfo = this.createTaskInfo();
      panel.append(taskInfo);
    }

    return panel;
  }

  private renderChallengesMenu(): void {
    if (!this.challengesMenu) return;

    DOMHelper.clearChildren(this.challengesMenu);

    const challengesContainer = DOMHelper.createElement(
      'div',
      'tasks-page__challenges-container',
    );
    challengesContainer.style.display = 'none';

    this.groupedChallenges[this.topicId]!.forEach((challenge) => {
      const challengeItem = DOMHelper.createElement(
        'div',
        'menu-item',
        challenge.title,
      );

      const state = store.getState();
      const isSolved = state.questions.sessionResults[challenge.id];

      if (isSolved) {
        const solvedMark = DOMHelper.createElement(
          'span',
          'menu-item__solved',
          '  ✓ Решено',
        );
        challengeItem.appendChild(solvedMark);
      }

      challengeItem.addEventListener('click', async () => {
        this.currentChallenge = await ChallengeService.getChallengeById(
          challenge.id,
        );
        if (this.taskInfo && this.spinner) {
          DOMHelper.showSpinner(
            this.taskInfo,
            this.spinner.getElement().cloneNode(true) as HTMLElement,
          );
        }
        if (this.editorDiv && this.spinner) {
          DOMHelper.showSpinner(
            this.editorDiv,
            this.spinner.getElement().cloneNode(true) as HTMLElement,
          );
        }
        setTimeout(async () => {
          this.updateTaskDisplay(this.leftPanel!);
        }, BASE_TIME_SPINNER);
      });
      challengesContainer.append(challengeItem);
      challengesContainer.classList.add('custom-scroll');
    });

    const topicTitleBtn = new Button('Список задач по теме ▼', 'grey', () => {
      if (challengesContainer.style.display !== 'block') {
        challengesContainer.style.display = 'block';
        topicTitleBtn.setText('Список задач по теме ▲');
      } else {
        challengesContainer.style.display = 'none';
        topicTitleBtn.setText('Список задач по теме ▼');
      }
    });

    this.challengesMenu.append(topicTitleBtn.getElement(), challengesContainer);
  }

  private createTaskInfo(): HTMLElement {
    this.taskInfo = DOMHelper.createElement('div', 'tasks-page__task-info');

    const difficultyBadge = DOMHelper.createElement(
      'div',
      `tasks-page__difficulty tasks-page__difficulty--${this.currentChallenge!.difficulty}`,
      this.currentChallenge!.difficulty,
    );
    this.titleContainer = DOMHelper.createElement(
      'div',
      'tasks-page__title-container',
    );

    const taskTitle = DOMHelper.createElement(
      'h2',
      'tasks-page__task-title',
      this.currentChallenge!.title,
    );

    const taskDescription = DOMHelper.createElement(
      'p',
      'tasks-page__task-description',
      this.currentChallenge!.description,
    );

    this.titleContainer.appendChild(taskTitle);
    const state = store.getState();
    const isSolved = state.questions.sessionResults[this.currentChallenge!.id];

    if (isSolved) {
      const solvedMark = DOMHelper.createElement(
        'span',
        'tasks-page__solved-mark',
        '✓ Решено',
      );
      this.titleContainer.appendChild(solvedMark);
    }

    const examplesSection = this.createExamplesSection();

    this.taskInfo.append(
      difficultyBadge,
      this.titleContainer,
      taskDescription,
      examplesSection,
    );

    return this.taskInfo;
  }

  private createExamplesSection(): HTMLElement {
    const examplesSection = DOMHelper.createElement('p', 'examples-section');

    if (
      this.currentChallenge &&
      this.currentChallenge?.examples.length > ZERO
    ) {
      this.currentChallenge.examples.forEach((example) => {
        const exampleItem = DOMHelper.createElement(
          'div',
          'tasks-page__example',
        );

        const inputSpan = DOMHelper.createElement(
          'span',
          'tasks-page__example-input',
          `Input: ${JSON.stringify(example.input)}`,
        );

        const outputSpan = DOMHelper.createElement(
          'span',
          'tasks-page__example-output',
          `Result: ${JSON.stringify(example.output)}`,
        );

        exampleItem.append(inputSpan, outputSpan);
        examplesSection.append(exampleItem);
      });
    }

    return examplesSection;
  }

  private createRightPanel(): HTMLElement {
    const panel = DOMHelper.createElement(
      'div',
      'tasks-page__panel custom-scroll',
    );

    this.editorDiv = DOMHelper.createElement('div', 'tasks-page__editor-div');

    this.codeEditor = DOMHelper.createElement('textarea', 'tasks-page__editor');
    this.codeEditor.spellcheck = false;

    if (this.currentChallenge) {
      this.codeEditor.value = `function ${this.currentChallenge.functionName}() {\n  \n}`;
    }
    this.editorDiv.append(this.codeEditor);
    const buttonsContainer = DOMHelper.createElement(
      'div',
      'tasks-page__buttons',
    );

    const startTestsBtn = new Button('Запустить тесты', 'green', () =>
      this.runTests(),
    );
    const showSolutionBtn = new Button('Показать решение', 'grey', () =>
      this.showSolution(),
    );

    buttonsContainer.append(
      startTestsBtn.getElement(),
      showSolutionBtn.getElement(),
    );

    this.resultsContainer = DOMHelper.createElement(
      'div',
      'tasks-page__results',
    );

    panel.append(this.editorDiv, buttonsContainer, this.resultsContainer);

    return panel;
  }

  private async loadRandomChallengeByTopic(): Promise<void> {
    if (this.leftPanel && this.spinner) {
      DOMHelper.showSpinner(
        this.leftPanel,
        this.spinner.getElement().cloneNode(true) as HTMLElement,
      );
    }
    if (this.editorDiv && this.spinner) {
      DOMHelper.showSpinner(
        this.editorDiv,
        this.spinner.getElement().cloneNode(true) as HTMLElement,
      );
    }
    setTimeout(async () => {
      try {
        this.currentChallenge =
          await ChallengeService.getRandomChallengeByTopic(this.topicId);
        this.updateTaskDisplay(this.leftPanel!);
      } catch {
        TasksPage.showError('Не удалось загрузить задачу.', this.leftPanel!);
        TasksPage.showError('Не удалось загрузить задачу.', this.editorDiv!);
      }
    }, BASE_TIME_SPINNER);
  }

  private updateTaskDisplay(leftPanel: HTMLElement): void {
    if (!this.currentChallenge || !leftPanel) return;
    DOMHelper.clearChildren(leftPanel);
    DOMHelper.clearChildren(this.editorDiv!);

    if (this.challengesMenu) {
      leftPanel.append(this.challengesMenu);
    }

    const taskInfo = this.createTaskInfo();
    leftPanel.append(taskInfo);

    this.editorDiv?.append(this.codeEditor!);
    if (this.codeEditor) {
      this.codeEditor.value = `function ${this.currentChallenge.functionName}() {\n  \n}`;
    }

    if (this.resultsContainer) {
      DOMHelper.clearChildren(this.resultsContainer);
      this.resultsContainer.className = 'tasks-page__results';
    }
  }

  private async runTests(): Promise<void> {
    if (this.resultsContainer && this.spinner) {
      DOMHelper.showSpinner(this.resultsContainer, this.spinner.getElement());
    }
    setTimeout(async () => {
      if (!this.currentChallenge || !this.codeEditor || !this.resultsContainer)
        return;
      this.currentChallenge.tests = (
        await ChallengeService.getTestsForChallenge(this.currentChallenge.id)
      ).tests;
      const code = this.codeEditor.value.trim();
      let result;
      if (this.currentChallenge.category === 'core-js') {
        result = ChallengeService.runBasicJsCode(
          code,
          this.currentChallenge.tests,
        );
        this.showResults(result);
        this.markChallengeAsSolvedIfNeeded(result);
      }
      if (this.currentChallenge.category === 'closures') {
        result = ChallengeService.runClosureCode(
          code,
          this.currentChallenge.tests,
        );
        this.showResults(result);
        this.markChallengeAsSolvedIfNeeded(result);
      }
      if (this.currentChallenge.category === 'asynchrony') {
        result = ChallengeService.runAsyncCode(
          code,
          this.currentChallenge.tests,
        );
        this.showResults(await result);
        this.markChallengeAsSolvedIfNeeded(await result);
      }
      if (this.currentChallenge.category === 'data-structures') {
        result = ChallengeService.runStructuresCode(
          code,
          this.currentChallenge.tests,
        );
        this.showResults(result);
        this.markChallengeAsSolvedIfNeeded(result);
      }
    }, BASE_TIME_SPINNER);
    // const resultTests = await ChallengeService.checkSolution(
    //   this.currentChallenge.id,
    //   this.codeEditor.value,
    // );
  }

  private markChallengeAsSolvedIfNeeded(result: CheckResult): void {
    if (result.allPassed && this.currentChallenge) {
      store.dispatch(
        setQuestionResult({
          id: this.currentChallenge.id,
          solved: true,
        }),
      );
    }
    this.loadChallengesMenu();

    if (
      this.titleContainer &&
      !this.titleContainer.querySelector('.tasks-page__solved-mark')
    ) {
      const solvedMark = DOMHelper.createElement(
        'span',
        'tasks-page__solved-mark',
        '✓ Решено',
      );
      this.titleContainer.appendChild(solvedMark);
    }
  }

  private static showError(message: string, div: HTMLElement): void {
    DOMHelper.clearChildren(div);
    const errorDiv = DOMHelper.createElement(
      'div',
      'tasks-page__error',
      message,
    );
    div.append(errorDiv);
  }

  private showResults(result: CheckResult): void {
    if (!this.resultsContainer) return;

    DOMHelper.clearChildren(this.resultsContainer);
    const summary = DOMHelper.createElement(
      'div',
      'tasks-page__results-summary',
      result.message,
    );

    this.resultsContainer.append(summary);

    if (result.results.length > ZERO) {
      const testsList = DOMHelper.createElement(
        'div',
        'tasks-page__tests-list',
      );
      result.results.forEach((test) => {
        const testItem = DOMHelper.createElement(
          'div',
          `tasks-page__test-item ${test.passed ? 'tasks-page__test-item--passed' : 'tasks-page__test-item--failed'}`,
        );
        const testDetails = DOMHelper.createElement(
          'div',
          'tasks-page__test-details',
        );

        const inputLine = DOMHelper.createElement(
          'div',
          '',
          `Input ${JSON.stringify(test.input)}`,
        );
        const expectedLine = DOMHelper.createElement(
          'div',
          '',
          `Expected ${JSON.stringify(test.expected)}`,
        );
        const actualLine = DOMHelper.createElement(
          'div',
          '',
          `Result ${JSON.stringify(test.actual)}`,
        );

        testDetails.append(inputLine, expectedLine, actualLine);

        if (test.error) {
          const error = DOMHelper.createElement(
            'div',
            'tasks-page__test-error',
            test.error,
          );
          testDetails.append(error);
        }

        testItem.append(testDetails);
        testsList.append(testItem);
      });

      this.resultsContainer.append(testsList);
    }
  }

  private async showSolution(): Promise<void> {
    if (!this.currentChallenge || !this.codeEditor) return;

    const popup = new Popup({
      message: 'Вы уверены, что хотите посмотреть решение?',
      confirmText: 'Да',
      cancelText: 'Нет',
      showCancel: true,
      onConfirm: async () => {
        this.solution = await ChallengeService.getSolution(
          this.currentChallenge!.id,
        );
        this.codeEditor!.value = this.solution.solution;
      },
      onCancel: () => {
        // Заглушка пока
      },
    });

    popup.show();
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
